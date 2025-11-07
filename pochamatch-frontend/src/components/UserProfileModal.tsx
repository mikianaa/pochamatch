import React from 'react';
import { User, Profile } from '../lib/api';
import { formatRelativeJp, calculateAge } from '../lib/format';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { X, MoreVertical, CheckCircle } from 'lucide-react';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'preview';
  user?: User;
  draftProfile?: Partial<Profile>;
  onLike?: (userId: number) => Promise<void>;
  onMessageLike?: (userId: number) => void;
  showActions?: boolean;
}

const KeyValueRow: React.FC<{ label: string; value?: string | number | string[] }> = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  const displayValue = Array.isArray(value) ? value.join('、') : value;

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 py-2 border-b border-gray-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{displayValue}</div>
    </div>
  );
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
  mode,
  user,
  draftProfile,
  onLike,
  onMessageLike,
  showActions = true,
}) => {
  const profile = mode === 'view' ? user?.profile : draftProfile;
  const displayName = mode === 'view' ? user?.nickname : draftProfile?.nickname;
  const age = mode === 'view' 
    ? user?.profile?.age 
    : (draftProfile?.birthdate ? calculateAge(draftProfile.birthdate) : undefined);
  const prefecture = profile?.prefecture;
  const photoUrl = profile?.photo_url;
  const verified = mode === 'view' ? user?.profile?.verified : false;
  const loginTime = mode === 'view' && user?.created_at ? formatRelativeJp(user.created_at) : undefined;

  const handleLikeClick = async () => {
    if (onLike && user?.id) {
      await onLike(user.id);
    }
  };

  const handleMessageLikeClick = () => {
    if (onMessageLike && user?.id) {
      onMessageLike(user.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="relative aspect-square bg-gray-200">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName || 'プロフィール写真'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                No Photo
              </div>
            )}
            
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <X size={24} className="text-gray-700" />
            </button>

            {mode === 'view' && (
              <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                <MoreVertical size={24} className="text-gray-700" />
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              {verified && (
                <div className="bg-blue-500 rounded-full p-1">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}
              <h2 className="text-2xl font-bold">{displayName || '名前未設定'}</h2>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              {age && <span>{age}歳</span>}
              {prefecture && (
                <>
                  {age && <span>/</span>}
                  <span>{prefecture}</span>
                </>
              )}
              {loginTime && mode === 'view' && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center gap-1 text-pink-500">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {loginTime}
                  </span>
                </>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-2">マイタグ</h3>
              <p className="text-sm text-gray-500">マイタグ未登録</p>
            </div>

            {profile?.bio && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">自己紹介</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">基本情報</h3>
              <div className="space-y-1">
                <KeyValueRow label="年齢" value={age ? `${age}歳` : undefined} />
                <KeyValueRow label="居住地" value={profile?.prefecture} />
                <KeyValueRow label="出身地" value={profile?.hometown} />
                <KeyValueRow label="学歴" value={profile?.education} />
                <KeyValueRow label="職種" value={profile?.occupation} />
                <KeyValueRow label="年収" value={profile?.income} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">外見・性格</h3>
              <div className="space-y-1">
                <KeyValueRow label="体型" value={profile?.body_type} />
                <KeyValueRow label="身長" value={profile?.height ? `${profile.height}cm` : undefined} />
                <KeyValueRow label="性格" value={profile?.personality} />
                <KeyValueRow label="社交性" value={profile?.sociability} />
                <KeyValueRow label="16タイプ診断" value={profile?.mbti} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">ライフスタイル</h3>
              <div className="space-y-1">
                <KeyValueRow label="休日" value={profile?.holiday} />
                <KeyValueRow label="たばこ" value={profile?.smoking} />
                <KeyValueRow label="お酒" value={profile?.drinking} />
                <KeyValueRow label="趣味" value={profile?.hobbies} />
                <KeyValueRow label="同居人" value={profile?.roommate} />
                <KeyValueRow label="デート費用" value={profile?.date_cost} />
                <KeyValueRow label="出会うまでの希望" value={profile?.meeting_preference} />
                <KeyValueRow label="結婚に対する意思" value={profile?.marriage_intention} />
                <KeyValueRow label="子供がほしいか" value={profile?.want_children} />
                <KeyValueRow label="家事・育児" value={profile?.housework} />
                <KeyValueRow label="結婚歴" value={profile?.marital_status} />
              </div>
            </div>

            {showActions && mode === 'view' && (
              <div className="sticky bottom-0 bg-white pt-4 pb-2 space-y-3 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Button
                  onClick={handleLikeClick}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-6 text-lg font-semibold"
                >
                  いいね
                </Button>
                <Button
                  onClick={handleMessageLikeClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white py-6 text-sm font-semibold"
                  disabled
                >
                  メッセージ付きいいね（有料プランに登録が必要です）
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
