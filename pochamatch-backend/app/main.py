from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta
from typing import List, Optional

from app.models import (
    UserCreate, UserLogin, User, Token, TokenData,
    ProfileUpdate, Profile, UserWithProfile,
    LikeCreate, Like, Match, MessageCreate, Message,
    SearchFilters
)
from app.database import db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not isinstance(email, str):
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/auth/signup", response_model=Token)
async def signup(user: UserCreate):
    existing_user = db.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_user = db.create_user(user.email, user.password, user.nickname)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = db.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = db.get_user_by_email(user.email)
    if not db_user or not db.verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = db.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = db.get_user_by_email(form_data.username)
    if not db_user or not db.verify_password(form_data.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = db.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserWithProfile)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    profile = db.get_profile(current_user["id"])
    return {
        **current_user,
        "profile": profile
    }

@app.get("/api/users", response_model=List[UserWithProfile])
async def get_users(
    current_user: dict = Depends(get_current_user),
    body_type: Optional[str] = None,
    prefecture: Optional[str] = None,
    show_no_icon: bool = True
):
    users = db.get_all_users_with_profiles(exclude_user_id=current_user["id"])
    
    if body_type:
        users = [u for u in users if u.get("profile", {}).get("body_type") == body_type]
    
    if prefecture:
        users = [u for u in users if u.get("profile", {}).get("prefecture") == prefecture]
    
    if not show_no_icon:
        users = [u for u in users if u.get("profile", {}).get("photo_url")]
    
    return users

@app.get("/api/users/{user_id}", response_model=UserWithProfile)
async def get_user(user_id: int, current_user: dict = Depends(get_current_user)):
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.get_profile(user_id)
    return {
        **user,
        "profile": profile
    }

@app.get("/api/profile", response_model=Profile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    profile = db.get_profile(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profile", response_model=Profile)
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    updated_profile = db.update_profile(
        current_user["id"],
        profile_data.model_dump(exclude_unset=True)
    )
    return updated_profile

@app.post("/api/likes", response_model=Like)
async def create_like(
    like_data: LikeCreate,
    current_user: dict = Depends(get_current_user)
):
    target_user = db.get_user_by_id(like_data.target_user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
    
    if like_data.target_user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot like yourself")
    
    like = db.create_like(current_user["id"], like_data.target_user_id)
    return like

@app.get("/api/likes/sent", response_model=List[UserWithProfile])
async def get_sent_likes(current_user: dict = Depends(get_current_user)):
    likes = db.get_likes_sent_by_user(current_user["id"])
    result = []
    for like in likes:
        user = db.get_user_by_id(like["target_user_id"])
        if user:
            profile = db.get_profile(like["target_user_id"])
            result.append({
                **user,
                "profile": profile
            })
    return result

@app.get("/api/likes/received", response_model=List[UserWithProfile])
async def get_received_likes(current_user: dict = Depends(get_current_user)):
    likes = db.get_likes_received_by_user(current_user["id"])
    result = []
    for like in likes:
        user = db.get_user_by_id(like["user_id"])
        if user:
            profile = db.get_profile(like["user_id"])
            result.append({
                **user,
                "profile": profile
            })
    return result

@app.get("/api/matches", response_model=List[dict])
async def get_matches(current_user: dict = Depends(get_current_user)):
    matches = db.get_matches_for_user(current_user["id"])
    result = []
    for match in matches:
        other_user_id = match["user2_id"] if match["user1_id"] == current_user["id"] else match["user1_id"]
        other_user = db.get_user_by_id(other_user_id)
        if other_user:
            profile = db.get_profile(other_user_id)
            result.append({
                "match_id": match["id"],
                "created_at": match["created_at"],
                "user": {
                    **other_user,
                    "profile": profile
                }
            })
    return result

@app.get("/api/matches/{match_id}/messages", response_model=List[Message])
async def get_match_messages(
    match_id: int,
    current_user: dict = Depends(get_current_user)
):
    match = db.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    if current_user["id"] not in [match["user1_id"], match["user2_id"]]:
        raise HTTPException(status_code=403, detail="Not authorized to view this match")
    
    messages = db.get_messages_for_match(match_id)
    return messages

@app.post("/api/matches/{match_id}/messages", response_model=Message)
async def send_message(
    match_id: int,
    message_data: MessageCreate,
    current_user: dict = Depends(get_current_user)
):
    match = db.get_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    if current_user["id"] not in [match["user1_id"], match["user2_id"]]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this match")
    
    message = db.create_message(match_id, current_user["id"], message_data.content)
    return message

@app.get("/api/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    likes_sent = len(db.get_likes_sent_by_user(current_user["id"]))
    likes_received = len(db.get_likes_received_by_user(current_user["id"]))
    matches = len(db.get_matches_for_user(current_user["id"]))
    
    remaining_likes = max(0, 33 - likes_sent)
    
    profile = db.get_profile(current_user["id"]) or {}
    verified = bool(profile.get("verified", False))
    
    return {
        "remaining_likes": remaining_likes,
        "likes_sent": likes_sent,
        "likes_received": likes_received,
        "matches": matches,
        "verified": verified,
        "premium": False
    }
