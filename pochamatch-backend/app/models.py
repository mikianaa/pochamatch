from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    nickname: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    profile_completed: bool = False
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

class ProfileBase(BaseModel):
    nickname: str
    birthdate: Optional[str] = None
    prefecture: Optional[str] = None
    hometown: Optional[str] = None
    education: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[str] = None
    body_type: Optional[str] = None
    height: Optional[int] = None
    personality: Optional[List[str]] = []
    sociability: Optional[str] = None
    mbti: Optional[str] = None
    holiday: Optional[str] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    hobbies: Optional[str] = None
    roommate: Optional[str] = None
    date_cost: Optional[str] = None
    meeting_preference: Optional[str] = None
    marriage_intention: Optional[str] = None
    want_children: Optional[str] = None
    housework: Optional[str] = None
    marital_status: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    verified: bool = False

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    user_id: int
    age: Optional[int] = None
    
    class Config:
        from_attributes = True

class UserWithProfile(User):
    profile: Optional[Profile] = None

class LikeCreate(BaseModel):
    target_user_id: int

class Like(BaseModel):
    id: int
    user_id: int
    target_user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Match(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str

class Message(BaseModel):
    id: int
    match_id: int
    sender_id: int
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SearchFilters(BaseModel):
    body_type: Optional[str] = None
    roommate: Optional[str] = None
    siblings: Optional[str] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    prefecture: Optional[str] = None
    occupation: Optional[str] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    show_no_icon: bool = True
