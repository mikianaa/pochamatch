from datetime import datetime, timedelta
from typing import Dict, List, Optional
import hashlib
from jose import JWTError, jwt
from app.models import User, Profile, Like, Match, Message

SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[int, Dict] = {}
        self.profiles: Dict[int, Dict] = {}
        self.likes: Dict[int, Dict] = {}
        self.matches: Dict[int, Dict] = {}
        self.messages: Dict[int, Dict] = {}
        self.user_id_counter = 1
        self.like_id_counter = 1
        self.match_id_counter = 1
        self.message_id_counter = 1
        
        self._seed_data()
    
    def _seed_data(self):
        demo_users = [
            {
                "email": "user1@example.com",
                "password": self.get_password_hash("password123"),
                "nickname": "さくら",
                "birthdate": "1995/03/15",
                "prefecture": "東京都",
                "body_type": "ぽっちゃり",
                "verified": True,
                "photo_url": "https://via.placeholder.com/300"
            },
            {
                "email": "user2@example.com",
                "password": self.get_password_hash("password123"),
                "nickname": "ゆうき",
                "birthdate": "1992/07/22",
                "prefecture": "大阪府",
                "body_type": "ぽっちゃり",
                "verified": True,
                "photo_url": "https://via.placeholder.com/300"
            },
            {
                "email": "user3@example.com",
                "password": self.get_password_hash("password123"),
                "nickname": "あやか",
                "birthdate": "1998/11/08",
                "prefecture": "神奈川県",
                "body_type": "ぽっちゃり",
                "verified": False,
                "photo_url": None
            },
            {
                "email": "user4@example.com",
                "password": self.get_password_hash("password123"),
                "nickname": "たくや",
                "birthdate": "1990/05/30",
                "prefecture": "愛知県",
                "body_type": "ぽっちゃり",
                "verified": True,
                "photo_url": "https://via.placeholder.com/300"
            },
            {
                "email": "user5@example.com",
                "password": self.get_password_hash("password123"),
                "nickname": "みゆき",
                "birthdate": "1996/09/12",
                "prefecture": "福岡県",
                "body_type": "ぽっちゃり",
                "verified": True,
                "photo_url": "https://via.placeholder.com/300"
            },
        ]
        
        for user_data in demo_users:
            user_id = self.user_id_counter
            self.users[user_id] = {
                "id": user_id,
                "email": user_data["email"],
                "password": user_data["password"],
                "nickname": user_data["nickname"],
                "created_at": datetime.now(),
                "profile_completed": True
            }
            
            self.profiles[user_id] = {
                "user_id": user_id,
                "nickname": user_data["nickname"],
                "birthdate": user_data["birthdate"],
                "prefecture": user_data["prefecture"],
                "body_type": user_data["body_type"],
                "verified": user_data["verified"],
                "photo_url": user_data["photo_url"],
                "hometown": None,
                "education": None,
                "occupation": None,
                "income": None,
                "height": None,
                "personality": [],
                "sociability": None,
                "mbti": None,
                "holiday": None,
                "smoking": None,
                "drinking": None,
                "hobbies": None,
                "roommate": None,
                "date_cost": None,
                "meeting_preference": None,
                "marriage_intention": None,
                "want_children": None,
                "housework": None,
                "marital_status": None,
                "bio": None,
                "age": self._calculate_age(user_data["birthdate"])
            }
            
            self.user_id_counter += 1
    
    def _calculate_age(self, birthdate_str: str) -> Optional[int]:
        if not birthdate_str:
            return None
        try:
            birth_date = datetime.strptime(birthdate_str, "%Y/%m/%d")
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            return age
        except:
            return None
    
    def get_password_hash(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        for user in self.users.values():
            if user["email"] == email:
                return user
        return None
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        return self.users.get(user_id)
    
    def create_user(self, email: str, password: str, nickname: str) -> Dict:
        user_id = self.user_id_counter
        hashed_password = self.get_password_hash(password)
        user = {
            "id": user_id,
            "email": email,
            "password": hashed_password,
            "nickname": nickname,
            "created_at": datetime.now(),
            "profile_completed": False
        }
        self.users[user_id] = user
        
        self.profiles[user_id] = {
            "user_id": user_id,
            "nickname": nickname,
            "birthdate": None,
            "prefecture": None,
            "hometown": None,
            "education": None,
            "occupation": None,
            "income": None,
            "body_type": None,
            "height": None,
            "personality": [],
            "sociability": None,
            "mbti": None,
            "holiday": None,
            "smoking": None,
            "drinking": None,
            "hobbies": None,
            "roommate": None,
            "date_cost": None,
            "meeting_preference": None,
            "marriage_intention": None,
            "want_children": None,
            "housework": None,
            "marital_status": None,
            "bio": None,
            "photo_url": None,
            "verified": False,
            "age": None
        }
        
        self.user_id_counter += 1
        return user
    
    def get_profile(self, user_id: int) -> Optional[Dict]:
        return self.profiles.get(user_id)
    
    def update_profile(self, user_id: int, profile_data: Dict) -> Dict:
        if user_id not in self.profiles:
            self.profiles[user_id] = {"user_id": user_id}
        
        self.profiles[user_id].update(profile_data)
        
        if profile_data.get("birthdate"):
            self.profiles[user_id]["age"] = self._calculate_age(profile_data["birthdate"])
        
        if user_id in self.users:
            self.users[user_id]["profile_completed"] = True
        
        return self.profiles[user_id]
    
    def get_all_users_with_profiles(self, exclude_user_id: Optional[int] = None) -> List[Dict]:
        result = []
        for user_id, user in self.users.items():
            if exclude_user_id and user_id == exclude_user_id:
                continue
            profile = self.profiles.get(user_id, {})
            result.append({
                **user,
                "profile": profile
            })
        return result
    
    def create_like(self, user_id: int, target_user_id: int) -> Dict:
        for like in self.likes.values():
            if like["user_id"] == user_id and like["target_user_id"] == target_user_id:
                return like
        
        like_id = self.like_id_counter
        like = {
            "id": like_id,
            "user_id": user_id,
            "target_user_id": target_user_id,
            "created_at": datetime.now()
        }
        self.likes[like_id] = like
        self.like_id_counter += 1
        
        reverse_like = None
        for like_obj in self.likes.values():
            if like_obj["user_id"] == target_user_id and like_obj["target_user_id"] == user_id:
                reverse_like = like_obj
                break
        
        if reverse_like:
            match_id = self.match_id_counter
            match = {
                "id": match_id,
                "user1_id": min(user_id, target_user_id),
                "user2_id": max(user_id, target_user_id),
                "created_at": datetime.now()
            }
            self.matches[match_id] = match
            self.match_id_counter += 1
        
        return like
    
    def get_likes_sent_by_user(self, user_id: int) -> List[Dict]:
        return [like for like in self.likes.values() if like["user_id"] == user_id]
    
    def get_likes_received_by_user(self, user_id: int) -> List[Dict]:
        return [like for like in self.likes.values() if like["target_user_id"] == user_id]
    
    def get_matches_for_user(self, user_id: int) -> List[Dict]:
        return [match for match in self.matches.values() 
                if match["user1_id"] == user_id or match["user2_id"] == user_id]
    
    def get_match_by_id(self, match_id: int) -> Optional[Dict]:
        return self.matches.get(match_id)
    
    def create_message(self, match_id: int, sender_id: int, content: str) -> Dict:
        message_id = self.message_id_counter
        message = {
            "id": message_id,
            "match_id": match_id,
            "sender_id": sender_id,
            "content": content,
            "created_at": datetime.now()
        }
        self.messages[message_id] = message
        self.message_id_counter += 1
        return message
    
    def get_messages_for_match(self, match_id: int) -> List[Dict]:
        return sorted(
            [msg for msg in self.messages.values() if msg["match_id"] == match_id],
            key=lambda x: x["created_at"]
        )

db = InMemoryDatabase()
