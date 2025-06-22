type PersonItemProps = {
  name: string;
  avatarUrl?: string;
};

import defaultAvatar from "../assets/default-avatar.png";

const PersonItem = ({ name, avatarUrl }: PersonItemProps) => {
  return (
    <div className="person-item flex items-center gap-5">
      <img
        className="avatar w-16 h-16 rounded-full object-cover"
        src={avatarUrl || defaultAvatar}
        alt={name}
      />
      <span className="name text-lg text-white">{name}</span>
    </div>
  );
};

export default PersonItem;
