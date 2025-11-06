import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { likeAPI, User } from '../lib/api';
import { CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Likes: React.FC = () => {
  const [receivedLikes, setReceivedLikes] = useState<User[]>([]);
  const [sentLikes, setSentLikes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      const [received, sent] = await Promise.all([
        likeAPI.getReceivedLikes(),
        likeAPI.getSentLikes(),
      ]);
      setReceivedLikes(received);
      setSentLikes(sent);
    } catch (error) {
      console.error('Failed to load likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserGrid = (users: User[]) => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <div className="relative aspect-square bg-gray-200">
            {user.profile?.photo_url ? (
              <img
                src={user.profile.photo_url}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="font-semibold">{user.nickname}</div>
            <div className="text-sm text-gray-600">
              {user.profile?.age && `${user.profile.age}歳`}
              {user.profile?.prefecture && ` / ${user.profile.prefecture}`}
            </div>
            {user.profile?.verified && (
              <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                <CheckCircle size={14} />
                <span>認証済み</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-pink-50 p-4 border-b">
          <h1 className="text-xl font-bold text-center">いいね！履歴</h1>
        </div>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-white border-b">
            <TabsTrigger
              value="received"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              相手から
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              自分から
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            {loading ? (
              <div className="text-center py-8">読み込み中...</div>
            ) : receivedLikes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだいいねを受け取っていません
              </div>
            ) : (
              renderUserGrid(receivedLikes)
            )}
          </TabsContent>

          <TabsContent value="sent">
            {loading ? (
              <div className="text-center py-8">読み込み中...</div>
            ) : sentLikes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                まだいいねを送っていません
              </div>
            ) : (
              renderUserGrid(sentLikes)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Likes;
