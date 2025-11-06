import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, Profile } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({
    nickname: '',
    birthdate: '',
    prefecture: '',
    hometown: '',
    education: '',
    occupation: '',
    income: '',
    body_type: '',
    height: undefined,
    personality: [],
    sociability: '',
    mbti: '',
    holiday: '',
    smoking: '',
    drinking: '',
    hobbies: '',
    roommate: '',
    date_cost: '',
    meeting_preference: '',
    marriage_intention: '',
    want_children: '',
    housework: '',
    marital_status: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileAPI.updateProfile(profile);
      alert('プロフィールを更新しました');
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalityToggle = (trait: string) => {
    const current = profile.personality || [];
    if (current.includes(trait)) {
      setProfile({ ...profile, personality: current.filter(t => t !== trait) });
    } else {
      setProfile({ ...profile, personality: [...current, trait] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <div className="bg-white border-b p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/mypage')} className="text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold flex-1">プロフィール編集</h1>
        <button className="text-pink-600 text-sm" onClick={() => alert('プレビュー機能は開発中です')}>
          プレビュー
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            お写真の登録が不十分です！マッチング率向上のためにお写真登録が肝心です！ご登録をお願い致します。
          </p>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => alert('写真アップロード機能は開発中です')}
          >
            編集する
          </Button>
        </div>

        <div>
          <Label>自己紹介</Label>
          <Textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="よろしくお願いします😊"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {(profile.bio || '').length} / 500文字
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-lg font-semibold">
          基本情報
        </div>

        <div>
          <Label>名前 *必須</Label>
          <Input
            value={profile.nickname || ''}
            onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
            placeholder="ニックネーム"
          />
        </div>

        <div>
          <Label>生年月日 *必須</Label>
          <Input
            type="text"
            value={profile.birthdate || ''}
            onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
            placeholder="YYYY/MM/DD"
          />
        </div>

        <div>
          <Label>居住地 *必須</Label>
          <Select
            value={profile.prefecture || ''}
            onValueChange={(value) => setProfile({ ...profile, prefecture: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="東京都">東京都</SelectItem>
              <SelectItem value="大阪府">大阪府</SelectItem>
              <SelectItem value="神奈川県">神奈川県</SelectItem>
              <SelectItem value="愛知県">愛知県</SelectItem>
              <SelectItem value="福岡県">福岡県</SelectItem>
              <SelectItem value="北海道">北海道</SelectItem>
              <SelectItem value="長野県">長野県</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>出身地</Label>
          <Select
            value={profile.hometown || ''}
            onValueChange={(value) => setProfile({ ...profile, hometown: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="東京都">東京都</SelectItem>
              <SelectItem value="大阪府">大阪府</SelectItem>
              <SelectItem value="神奈川県">神奈川県</SelectItem>
              <SelectItem value="愛知県">愛知県</SelectItem>
              <SelectItem value="福岡県">福岡県</SelectItem>
              <SelectItem value="長野県">長野県</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>学歴</Label>
          <Select
            value={profile.education || ''}
            onValueChange={(value) => setProfile({ ...profile, education: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="高校卒">高校卒</SelectItem>
              <SelectItem value="専門学校卒">専門学校卒</SelectItem>
              <SelectItem value="大学卒">大学卒</SelectItem>
              <SelectItem value="大学院卒">大学院卒</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>職種</Label>
          <Select
            value={profile.occupation || ''}
            onValueChange={(value) => setProfile({ ...profile, occupation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="エンジニア">エンジニア</SelectItem>
              <SelectItem value="デザイナー">デザイナー</SelectItem>
              <SelectItem value="営業">営業</SelectItem>
              <SelectItem value="事務">事務</SelectItem>
              <SelectItem value="サービス業">サービス業</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>年収</Label>
          <Select
            value={profile.income || ''}
            onValueChange={(value) => setProfile({ ...profile, income: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="〜300万円">〜300万円</SelectItem>
              <SelectItem value="301万円〜500万円">301万円〜500万円</SelectItem>
              <SelectItem value="501万円〜700万円">501万円〜700万円</SelectItem>
              <SelectItem value="701万円〜1000万円">701万円〜1000万円</SelectItem>
              <SelectItem value="1001万円〜1500万円">1001万円〜1500万円</SelectItem>
              <SelectItem value="1501万円〜2000万円">1501万円〜2000万円</SelectItem>
              <SelectItem value="2001万円〜">2001万円〜</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-lg font-semibold">
          外見・内面
        </div>

        <div>
          <Label>体型</Label>
          <Select
            value={profile.body_type || ''}
            onValueChange={(value) => setProfile({ ...profile, body_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="スリム">スリム</SelectItem>
              <SelectItem value="普通">普通</SelectItem>
              <SelectItem value="ぽっちゃり">ぽっちゃり</SelectItem>
              <SelectItem value="体型はあなた次第">体型はあなた次第</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>身長 (cm)</Label>
          <Input
            type="number"
            value={profile.height || ''}
            onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
            placeholder="170"
          />
        </div>

        <div>
          <Label>性格</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['優しい', '素直', '決断力がある', '明るい', '真面目', '穏やか'].map((trait) => (
              <button
                key={trait}
                onClick={() => handlePersonalityToggle(trait)}
                className={`px-4 py-2 rounded-full text-sm ${
                  (profile.personality || []).includes(trait)
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {(profile.personality || []).includes(trait) && '× '}
                {trait}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>社交性</Label>
          <Select
            value={profile.sociability || ''}
            onValueChange={(value) => setProfile({ ...profile, sociability: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="人見知り">人見知り</SelectItem>
              <SelectItem value="普通">普通</SelectItem>
              <SelectItem value="社交的">社交的</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>16タイプ診断</Label>
          <Select
            value={profile.mbti || ''}
            onValueChange={(value) => setProfile({ ...profile, mbti: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFJ">INFJ</SelectItem>
              <SelectItem value="INFP">INFP</SelectItem>
              <SelectItem value="ENFJ">ENFJ</SelectItem>
              <SelectItem value="ENFP">ENFP</SelectItem>
              <SelectItem value="INTJ">INTJ</SelectItem>
              <SelectItem value="INTP">INTP</SelectItem>
              <SelectItem value="ENTJ">ENTJ</SelectItem>
              <SelectItem value="ENTP">ENTP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-lg font-semibold">
          ライフスタイル
        </div>

        <div>
          <Label>休日</Label>
          <Select
            value={profile.holiday || ''}
            onValueChange={(value) => setProfile({ ...profile, holiday: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="土日">土日</SelectItem>
              <SelectItem value="平日">平日</SelectItem>
              <SelectItem value="不定期">不定期</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>たばこ</Label>
          <Select
            value={profile.smoking || ''}
            onValueChange={(value) => setProfile({ ...profile, smoking: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="吸う">吸う</SelectItem>
              <SelectItem value="吸わない">吸わない</SelectItem>
              <SelectItem value="喫煙">喫煙</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>お酒</Label>
          <Select
            value={profile.drinking || ''}
            onValueChange={(value) => setProfile({ ...profile, drinking: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="飲む">飲む</SelectItem>
              <SelectItem value="飲まない">飲まない</SelectItem>
              <SelectItem value="たまに飲む">たまに飲む</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>趣味</Label>
          <Input
            value={profile.hobbies || ''}
            onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
            placeholder="趣味"
          />
        </div>

        <div>
          <Label>同居人</Label>
          <Select
            value={profile.roommate || ''}
            onValueChange={(value) => setProfile({ ...profile, roommate: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="一人暮らし">一人暮らし</SelectItem>
              <SelectItem value="家族と同居">家族と同居</SelectItem>
              <SelectItem value="ルームシェア">ルームシェア</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>デート費用</Label>
          <Select
            value={profile.date_cost || ''}
            onValueChange={(value) => setProfile({ ...profile, date_cost: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="割り勘">割り勘</SelectItem>
              <SelectItem value="男性が多め">男性が多め</SelectItem>
              <SelectItem value="男性が全て">男性が全て</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>出会うまでの希望</Label>
          <Select
            value={profile.meeting_preference || ''}
            onValueChange={(value) => setProfile({ ...profile, meeting_preference: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="すぐ会いたい">すぐ会いたい</SelectItem>
              <SelectItem value="まずはメッセージから">まずはメッセージから</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>結婚に対する意思</Label>
          <Select
            value={profile.marriage_intention || ''}
            onValueChange={(value) => setProfile({ ...profile, marriage_intention: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="すぐにでも">すぐにでも</SelectItem>
              <SelectItem value="良い人がいれば">良い人がいれば</SelectItem>
              <SelectItem value="まだ考えていない">まだ考えていない</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>子供がほしいか</Label>
          <Select
            value={profile.want_children || ''}
            onValueChange={(value) => setProfile({ ...profile, want_children: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="はい">はい</SelectItem>
              <SelectItem value="いいえ">いいえ</SelectItem>
              <SelectItem value="未定">未定</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>家事・育児</Label>
          <Select
            value={profile.housework || ''}
            onValueChange={(value) => setProfile({ ...profile, housework: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="分担したい">分担したい</SelectItem>
              <SelectItem value="任せたい">任せたい</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>結婚歴</Label>
          <Select
            value={profile.marital_status || ''}
            onValueChange={(value) => setProfile({ ...profile, marital_status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="選択する" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="未婚">未婚</SelectItem>
              <SelectItem value="離婚">離婚</SelectItem>
              <SelectItem value="死別">死別</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 py-6 text-lg"
        >
          {saving ? '保存中...' : '変更・登録'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEdit;
