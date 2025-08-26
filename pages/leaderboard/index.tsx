import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function Leaderboard() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onToggleHandler = () => {
    setCollapsed((prev) => !prev);
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar collapsed={collapsed} onToggle={onToggleHandler} />
    </div>
  );
}