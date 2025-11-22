const colors = {
  sage: '#B6CBBD',
  brown: '#754E1A',
  gold: '#CBA35C',
  cream: '#F8E1B7'
};

export default colors;

export const theme = {
  palette: { ...colors },
  spacing: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  radii: { sm: 6, md: 10, lg: 16, xl: 18, pill: 999 },
  shadows: {
    sm: '0 2px 10px rgba(117,78,26,0.10)',
    md: '0 4px 18px rgba(117,78,26,0.15)',
    lg: '0 10px 34px rgba(117,78,26,0.30)'
  },
  typography: {
    fontFamily: 'system-ui, Arial, sans-serif',
    h1: { size: 30, weight: 700 },
    h2: { size: 22, weight: 700 },
    body: { size: 14, weight: 500 }
  },
  breakpoints: { sm: 480, md: 768, lg: 1024 },
  zIndex: { modal: 1000, header: 100 }
};

export const components = {
  button: {
    base: { background: colors.gold, color: colors.brown, border: `1px solid ${colors.brown}` },
    primary: { background: colors.gold, color: colors.brown, border: `1px solid ${colors.brown}` },
    secondary: { background: colors.cream, color: colors.brown, border: `1px solid ${colors.gold}` },
    subtle: { background: colors.sage, color: colors.brown, border: `1px solid ${colors.brown}` }
  },
  input: { background: colors.cream, color: colors.brown, border: `1px solid ${colors.gold}` },
  card: { background: colors.sage, border: `1px solid ${colors.gold}`, shadow: '0 4px 18px rgba(117,78,26,0.15)' }
};

export function injectGlobalStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('app-theme-styles')) return;

  const css = `
  :root{
    --sage:${colors.sage};
    --brown:${colors.brown};
    --gold:${colors.gold};
    --cream:${colors.cream};
    --radius-sm:6px; --radius-md:10px; --radius-lg:16px; --radius-xl:18px;
    --shadow-sm:0 2px 10px rgba(117,78,26,0.10);
    --shadow-md:0 4px 18px rgba(117,78,26,0.15);
    --shadow-lg:0 10px 34px rgba(117,78,26,0.30);
  }
  *,*::before,*::after{ box-sizing:border-box; }
  html,body,#root{ height:100%; }
  body{ margin:0; font-family:${theme.typography.fontFamily}; background:var(--cream); color:var(--brown); }
  a{ color:var(--brown); text-decoration:none; }
  a:hover{ text-decoration:underline; text-decoration-color:var(--gold); }
  .container{ width:100%; max-width:1200px; margin:0 auto; padding:0 20px; }
  .card{ background:var(--sage); border:1px solid var(--gold); border-radius:18px; box-shadow:var(--shadow-md); padding:24px; }
  .btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:600; font-size:14px; cursor:pointer; padding:12px 16px; border-radius:10px; border:1px solid transparent; transition:.2s transform,.2s background; }
  .btn:hover{ transform:translateY(-2px); }
  .btn-primary{ background:var(--gold); color:var(--brown); border-color:var(--brown); }
  .btn-primary:hover{ background:#b28e4f; }
  .btn-secondary{ background:var(--cream); color:var(--brown); border-color:var(--gold); }
  .btn-secondary:hover{ background:#eecf9d; }
  .btn-cancel{ background:var(--sage); color:var(--brown); border:1px solid var(--brown); }
  .btn-cancel:hover{ background:#aac3b2; }
  .input,.select,input[type="text"],input[type="email"],input[type="password"],select,textarea{
    width:100%; background:var(--cream); border:1px solid var(--gold); color:var(--brown); padding:12px 14px; border-radius:10px; outline:none; font-size:14px; transition:.2s border,.2s background;
  }
  .input:focus,.select:focus,input:focus,select:focus,textarea:focus{ border-color:var(--brown); background:#fff5e3; }
  .auth-wrapper{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 20px; }
  .auth-card{ width:100%; max-width:420px; background:var(--sage); border:1px solid var(--gold); border-radius:16px; padding:44px 40px 36px; box-shadow:var(--shadow-md); }
  .auth-card h2{ margin:0 0 24px; font-size:22px; font-weight:700; color:var(--brown); }
  .auth-card form{ display:flex; flex-direction:column; gap:16px; }
  .auth-alt{ margin-top:12px; text-align:center; font-size:13px; color:var(--brown); }
  .auth-alt a{ font-weight:600; border-bottom:2px solid transparent; padding-bottom:2px; }
  .auth-alt a:hover{ border-color:var(--gold); }
  .msg{ min-height:18px; font-size:12px; color:var(--brown); }
  .profile-container{ min-height:100vh; background:var(--cream); padding:48px 24px; color:var(--brown); }
  .profile-wrapper{ max-width:1000px; margin:0 auto; }
  .profile-header,.profile-section{ background:var(--sage); border:1px solid var(--gold); border-radius:18px; padding:34px 36px; margin-bottom:28px; box-shadow:var(--shadow-md); }
  .profile-header-content{ display:flex; align-items:flex-start; justify-content:space-between; gap:28px; flex-wrap:wrap; }
  .profile-avatar-section{ display:flex; gap:28px; align-items:flex-start; }
  .profile-avatar{ position:relative; width:110px; height:110px; border-radius:50%; background:radial-gradient(circle at 30% 30%, var(--cream) 0%, var(--gold) 55%, var(--sage) 100%); display:flex; align-items:center; justify-content:center; font-size:34px; font-weight:700; color:var(--brown); border:3px solid var(--gold); box-shadow:0 4px 12px rgba(117,78,26,0.25); }
  .profile-info h1{ margin:0 0 10px; font-size:30px; font-weight:700; color:var(--brown); }
  .profile-info .role{ display:inline-block; padding:4px 10px; border-radius:6px; background:var(--gold); color:var(--brown); font-weight:600; }
  .profile-info .employee-id{ color:#997644; font-size:13px; margin-top:6px; }
  .profile-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:26px; }
  .profile-value{ color:var(--brown); font-size:15px; min-height:48px; display:flex; align-items:center; font-weight:500; }
  .admin-note{ color:#997644; font-size:12px; margin-top:18px; padding:14px 16px; background:var(--cream); border-left:4px solid var(--gold); border-radius:8px; font-style:italic; }
  .modal-overlay{ position:fixed; inset:0; background:rgba(117,78,26,0.55); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:28px; z-index:1000; }
  .modal-content{ background:var(--sage); border:1px solid var(--gold); border-radius:18px; width:100%; max-width:520px; padding:36px 38px 34px; box-shadow:var(--shadow-lg); }
  .modal-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:26px; }
  .modal-header h3{ margin:0; font-size:24px; font-weight:700; color:var(--brown); }
  .modal-close{ background:none; border:none; color:#997644; cursor:pointer; padding:6px; border-radius:8px; }
  .modal-close:hover{ color:var(--brown); background:rgba(203,163,92,0.25); }
  .modal-body{ display:flex; flex-direction:column; gap:22px; }
  .modal-footer{ display:flex; gap:14px; margin-top:30px; }
  .modal-footer .btn{ flex:1; }
  @media (max-width:900px){ .profile-header,.profile-section{ padding:30px 28px; } .profile-avatar{ width:96px; height:96px; font-size:30px; } }
  @media (max-width:640px){ .profile-container{ padding:32px 16px; } .profile-header-content{ flex-direction:column; } .profile-grid{ grid-template-columns:1fr; } .auth-card{ padding:36px 28px 30px; } }
  `;

  const style = document.createElement('style');
  style.id = 'app-theme-styles';
  style.textContent = css;
  document.head.appendChild(style);
}
