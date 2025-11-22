import React from "react";
const colors = {
  sage: '#B6CBBD',
  brown: '#754E1A',
  gold: '#CBA35C',
  cream: '#F8E1B7'
};

const Navbar = () => (
  <nav style={{
    backgroundColor: colors.brown,
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `3px solid ${colors.gold}`
  }}>
    <div style={{ display: 'flex', gap: '32px' }}>
      {['Dashboard', 'Operations', 'Stock', 'Move History', 'Settings'].map((item) => (
        <a
          key={item}
          href="#"
          style={{
            color: colors.cream,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: item === 'Dashboard' ? '600' : '400',
            padding: '8px 4px',
            borderBottom: item === 'Dashboard' ? `2px solid ${colors.gold}` : 'none',
            transition: 'all 0.2s'
          }}
        >
          {item}
        </a>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <span style={{ color: colors.cream, fontSize: '16px', fontWeight: '600' }}>Dashboard</span>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: colors.gold,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.brown,
        fontWeight: '600',
        fontSize: '14px'
      }}>
        A
      </div>
    </div>
  </nav>
);

export default Navbar;