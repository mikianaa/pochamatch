import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { statsAPI, Stats } from '../lib/api';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const MyPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const menuItems = [
    { label: '足あと', description: '足あとを増やしましょう', path: '/footprints' },
    { label: 'お気に入り', path: '/favorites' },
    { label: 'お知らせ', path: '/notifications' },
    { label: '各種設定', path: '/settings' },
    { label: 'ヘルプ・問い合わせ', path: '/help' },
    { label: 'ご意見', path: '/feedback' },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-r from-pink-400 to-pink-300 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white overflow-hidden flex-shrink-0">
              {user?.profile?.photo_url ? (
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
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user?.nickname}</h2>
              <Button
                variant="outline"
                className="mt-2 bg-white hover:bg-gray-50"
                onClick={() => navigate('/profile/edit')}
              >
                プロフィールを確認・編集
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">
              プロフィールにSNSアカウントや連絡先を記載することは、規約により禁じております。ご記載はお控えいただきますようお願いします。
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-pink-800">メッセージ交換</span>
            </div>
            <h3 className="font-bold text-lg mb-2">
              本人確認と有料プラン登録がまだ完了しておりません
            </h3>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              onClick={() => alert('本人確認機能は開発中です')}
            >
              今すぐ確認する
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {stats?.remaining_likes || 0}
              </div>
              <div className="text-sm text-gray-600">残りいいね！</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats?.premium ? '登録済み' : '未登録'}
              </div>
              <div className="text-sm text-gray-600">有料プラン</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats?.verified ? '完了' : '提出未'}
              </div>
              <div className="text-sm text-gray-600">本人確認</div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.path) {
                    alert(`${item.label}は開発中です`);
                  }
                }}
                className="w-full flex items-center justify-between p-4 bg-white border-b hover:bg-gray-50"
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.label}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500">{item.description}</div>
                  )}
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyPage;
