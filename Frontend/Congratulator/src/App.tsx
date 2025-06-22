import { Outlet, NavLink, useLocation } from "react-router-dom";
import myGif from "./assets/twitch-dinodance.gif";

const Header = () => (
  <header className="h-12 flex items-center justify-center text-white font-bold text-3xl tracking-[10px] my-5">
    🎉 ПОЗДРАВЛЯТОР
  </header>
);

const MAIN_PANEL_WIDTH = 800;
const SIDE_PANEL_WIDTH = 90;
const RIGHT_PANEL_WIDTH = 300;

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#141414] text-white ">
      <Header />
      {/* Контейнер relative, занимает всю доступную высоту и ширину */}
      <div className="relative flex-1 flex justify-center ">
        {/* MainPanel по центру экрана */}
        <main
          className="overflow-y-auto text-white rounded-xl border border-white/20 bg-panel mb-10 "
          style={{ width: MAIN_PANEL_WIDTH }}
        >
          <Outlet />
        </main>

        {/* Sidebar слева от MainPanel */}
        <nav
          className="flex flex-col items-center py-4 gap-6 rounded-xl border border-white/20 bg-panel "
          style={{
            position: "absolute",
            width: SIDE_PANEL_WIDTH,
            left: `calc(50% - ${MAIN_PANEL_WIDTH / 2}px - ${
              SIDE_PANEL_WIDTH + 50
            }px)`, // 50px — отступ
          }}
        >
          <NavLink
            to="/"
            end
            title="Дом"
            className={({ isActive }) =>
              `w-[55px] h-[55px] rounded-md text-2xl text-center leading-[48px] border-2 p-2 transition-all ${
                isActive
                  ? "bg-main border-main text-white"
                  : "text-white/70 border-white/70 hover:text-white hover:border-white"
              }`
            }
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.55 2.533a2.25 2.25 0 0 1 2.9 0l6.75 5.695c.508.427.8 1.056.8 1.72v9.802a1.75 1.75 0 0 1-1.75 1.75h-3a1.75 1.75 0 0 1-1.75-1.75v-5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v5a1.75 1.75 0 0 1-1.75 1.75h-3A1.75 1.75 0 0 1 3 19.75V9.947c0-.663.292-1.292.8-1.72l6.75-5.694Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/catalog"
            title="Каталог"
            className={({ isActive }) =>
              `w-[55px] h-[55px] rounded-md text-2xl text-center leading-[48px] border-2 p-2 transition-all ${
                isActive
                  ? "bg-main border-main text-white"
                  : "text-white/70 border-white/70 hover:text-white hover:border-white"
              }`
            }
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.5 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4 .5h13.503a1 1 0 0 1 .117 1.993l-.117.007H7.5a1 1 0 0 1-.116-1.993L7.5 17h13.503H7.5Zm-4-6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4 .5h13.503a1 1 0 0 1 .117 1.993l-.117.007H7.5a1 1 0 0 1-.116-1.993L7.5 11h13.503H7.5Zm-4-6.492a1.5 1.5 0 1 1 0 2.999 1.5 1.5 0 0 1 0-3ZM7.5 5h13.503a1 1 0 0 1 .117 1.993l-.117.007H7.5a1 1 0 0 1-.116-1.994l.116-.006h13.503H7.5Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/settings"
            title="Настройки"
            className={({ isActive }) =>
              `w-[55px] h-[55px] rounded-md text-2xl text-center leading-[48px] border-2 transition-all p-2  ${
                isActive
                  ? "bg-main border-main text-white"
                  : "text-white/70 border-white/70 hover:text-white hover:border-white"
              }`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
        </nav>

        {/* RightPanel справа от MainPanel, если нужно */}
        {/* {isHome && (
          <aside
            className="p-4 text-white rounded-xl border border-white/20 bg-panel "
            style={{
              position: "absolute",
              width: RIGHT_PANEL_WIDTH,
              left: `calc(50% + ${MAIN_PANEL_WIDTH / 2}px + 50px)`,
            }}
          >
            <p>🎈 Это правая панель на главной странице</p>
          </aside>
        )} */}
      </div>
      <a
        href="https://github.com/oioiieii"
        target="_blank"
        rel="noopener noreferrer"
        title="by oioii"
        className="fixed bottom-0 right-5 w-30 h-30 z-50"
      >
        <img
          src={myGif}
          alt="dino dance"
          className="w-full h-full object-contain opacity-80 hover:opacity-100 transition"
        />
      </a>
    </div>
  );
};

export default App;
