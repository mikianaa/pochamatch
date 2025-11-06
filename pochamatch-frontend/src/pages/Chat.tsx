import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { matchAPI, Match } from '../lib/api';

const Chat: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await matchAPI.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-pink-50 p-4 border-b">
          <h1 className="text-xl font-bold text-center">チャット</h1>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              まだマッチングがありません
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.match_id}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => navigate(`/chat/${match.match_id}`)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {match.user.profile?.photo_url ? (
                    <img
                      src={match.user.profile.photo_url}
                      alt={match.user.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{match.user.nickname}</div>
                  <div className="text-sm text-gray-500">
                    マッチング成立: {new Date(match.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
