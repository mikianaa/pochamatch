import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { userAPI, likeAPI, User } from '../lib/api';
import { Heart, Filter, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const Explore: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    body_type: '',
    prefecture: '',
    show_no_icon: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId: number) => {
    try {
      await likeAPI.createLike(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to like user:', error);
    }
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    loadUsers();
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="bg-pink-50 p-4 border-b">
          <div className="bg-pink-100 border border-pink-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-pink-800">
              本人確認と有料プラン登録がまだ完了しておりません
            </p>
            <Button
              size="sm"
              className="mt-2 bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => navigate('/mypage')}
            >
              今すぐ確認する
            </Button>
          </div>

          <Tabs defaultValue="recommend" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-white">
              <TabsTrigger value="recommend" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                おすすめ
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                さがす
              </TabsTrigger>
              <TabsTrigger value="mytag" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                マイタグ
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-3 flex gap-2">
            <Input
              placeholder="絞り込んで探す"
              className="flex-1"
              onClick={() => setShowFilterModal(true)}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">読み込み中...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(user.id);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-pink-50"
                    >
                      <Heart size={20} className="text-pink-500" />
                    </button>
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
          )}
        </div>

        <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4">
          <div className="bg-pink-100 border border-pink-200 rounded-lg p-3 shadow-lg">
            <p className="text-sm text-pink-800">
              マッチングしにくい状態です　アイコンを登録しましょう
            </p>
            <Button
              size="sm"
              className="mt-2 bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => navigate('/profile/edit')}
            >
              登録する
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>絞り込み検索</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="basic">基礎</TabsTrigger>
              <TabsTrigger value="location">居住地</TabsTrigger>
              <TabsTrigger value="work">仕事</TabsTrigger>
              <TabsTrigger value="habits">たばこ・お酒</TabsTrigger>
              <TabsTrigger value="love">恋愛</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label>体型</Label>
                <Select
                  value={filters.body_type}
                  onValueChange={(value) => setFilters({ ...filters, body_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択する" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ぽっちゃり">ぽっちゃり</SelectItem>
                    <SelectItem value="普通">普通</SelectItem>
                    <SelectItem value="スリム">スリム</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>同居人</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="選択する" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="一人暮らし">一人暮らし</SelectItem>
                    <SelectItem value="家族と同居">家族と同居</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>兄弟姉妹</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="選択する" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="一人っ子">一人っ子</SelectItem>
                    <SelectItem value="兄弟あり">兄弟あり</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>年齢（開発中）</Label>
                <div className="flex gap-2 items-center">
                  <Input type="number" placeholder="下限" />
                  <span>〜</span>
                  <Input type="number" placeholder="上限" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-4">
              <div>
                <Label>都道府県</Label>
                <Select
                  value={filters.prefecture}
                  onValueChange={(value) => setFilters({ ...filters, prefecture: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択する" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="東京都">東京都</SelectItem>
                    <SelectItem value="大阪府">大阪府</SelectItem>
                    <SelectItem value="神奈川県">神奈川県</SelectItem>
                    <SelectItem value="愛知県">愛知県</SelectItem>
                    <SelectItem value="福岡県">福岡県</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-4 mt-4">
              <p className="text-sm text-gray-500">開発中</p>
            </TabsContent>

            <TabsContent value="habits" className="space-y-4 mt-4">
              <p className="text-sm text-gray-500">開発中</p>
            </TabsContent>

            <TabsContent value="love" className="space-y-4 mt-4">
              <p className="text-sm text-gray-500">開発中</p>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show_no_icon"
                checked={filters.show_no_icon}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, show_no_icon: checked as boolean })
                }
              />
              <Label htmlFor="show_no_icon">アイコンなしの方も表示する</Label>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              onClick={handleApplyFilters}
            >
              絞り込む
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowFilterModal(false)}
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Explore;
