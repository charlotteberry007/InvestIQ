import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-white/10
        bg-[#050914]/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-24
          w-full
          max-w-[1850px]
          items-center
          justify-between
          px-6
          md:px-10
          xl:px-14
          2xl:px-20
        "
      >
        {/* LOGO */}

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-20 items-center justify-center">
              <img
                src={logo}
                alt="InvestIQ"
                className="h-20 w-20"
              />
            </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              InvestIQ
            </h1>

            <p className="text-sm text-slate-400">
              AI Portfolio Tracker
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <div className="flex items-center gap-10">
          <NavItem
            label="Dashboard"
            active
            href="#"
          />

          <NavItem
            label="Portfolio"
            href="#portfolio"
          />

          <NavItem
            label="Analytics"
            href="#analytics"
          />

          <NavItem
            label="AI Advisor"
            href="#ai-assistant"
            highlighted
          />
        </div>
      </div>
    </nav>
  );
}

type NavItemProps = {
  label: string;
  href: string;
  active?: boolean;
  highlighted?: boolean;
};

function NavItem({
  label,
  href,
  active = false,
  highlighted = false,
}: NavItemProps) {
  return (
    <a
      href={href}
      className={`
        whitespace-nowrap
        text-lg
        font-medium
        transition-colors
        no-underline
        outline-none
        focus:outline-none
        ${
          active
            ? "text-blue-400"
            : "text-slate-300 hover:text-white"
        }
        ${
          highlighted
            ? "rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-blue-300 hover:bg-blue-500/20"
            : ""
        }
      `}
    >
      {label}
    </a>
  );
}