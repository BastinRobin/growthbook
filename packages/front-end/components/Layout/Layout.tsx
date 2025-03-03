import Link from "next/link";
import styles from "./Layout.module.scss";
import { useState, useContext } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import TopNav from "./TopNav";
import { FaArrowRight } from "react-icons/fa";
import {
  GBHome,
  GBIdea,
  GBDimensions,
  GBExperiment,
  GBMetrics,
  GBPresentations,
  GBSegments,
  GBSettings,
} from "../Icons";
import SidebarLink, { SidebarLinkProps } from "./SidebarLink";
import { UserContext } from "../ProtectedPage";
import ProjectSelector from "./ProjectSelector";

const navlinks: SidebarLinkProps[] = [
  {
    name: "Home",
    href: "/",
    Icon: GBHome,
    path: /^$/,
  },
  {
    name: "Ideas",
    href: "/ideas",
    Icon: GBIdea,
    path: /^idea/,
  },
  {
    name: "Experiments",
    href: "/experiments",
    Icon: GBExperiment,
    path: /^experiment/,
  },
  {
    name: "Presentations",
    href: "/presentations",
    Icon: GBPresentations,
    path: /^presentations/,
  },
  {
    name: "Metrics",
    href: "/metrics",
    Icon: GBMetrics,
    divider: true,
    sectionTitle: "Definitions",
    path: /^metric/,
  },
  {
    name: "Segments",
    href: "/segments",
    Icon: GBSegments,
    path: /^segment/,
  },
  {
    name: "Dimensions",
    href: "/dimensions",
    Icon: GBDimensions,
    path: /^dimension/,
  },
  {
    name: "Settings",
    href: "/settings",
    Icon: GBSettings,
    divider: true,
    path: /^(settings|admin|datasources)/,
    settingsPermission: true,
    autoClose: true,
    subLinks: [
      {
        name: "General",
        href: "/settings",
        path: /^settings$/,
      },
      {
        name: "Team",
        href: "/settings/team",
        path: /^settings\/team/,
      },
      {
        name: "Projects",
        href: "/settings/projects",
        path: /^settings\/projects/,
      },
      {
        name: "Billing",
        href: "/settings/billing",
        path: /^settings\/billing/,
        cloudOnly: true,
      },
      {
        name: "API Keys",
        href: "/settings/keys",
        path: /^settings\/keys/,
      },
      {
        name: "Webhooks",
        href: "/settings/webhooks",
        path: /^settings\/webhooks/,
      },
      {
        name: "Data Sources",
        href: "/datasources",
        path: /^datasources/,
      },
      {
        name: "Admin",
        href: "/admin",
        path: /^admin/,
        cloudOnly: true,
        divider: true,
        superAdmin: true,
      },
    ],
  },
];

const otherPageTitles = [
  {
    path: /^activity/,
    title: "Activity Feed",
  },
  {
    path: /^experiments\/designer/,
    title: "Visual Experiment Designer",
  },
];

const backgroundShade = (color: string) => {
  // convert to RGB
  const c = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));
  const r = c >> 16;
  const g = (c >> 8) & 255;
  const b = c & 255;
  // http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  if (hsp > 127.5) {
    return "light";
  } else {
    return "dark";
  }
};

const Layout = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { settings } = useContext(UserContext);

  // hacky:
  const router = useRouter();
  const path = router.route.substr(1);
  // don't show the nav for presentations
  if (path.match(/^present\//)) {
    return null;
  }

  let pageTitle: string;
  otherPageTitles.forEach((o) => {
    if (!pageTitle && o.path.test(path)) {
      pageTitle = o.title;
    }
  });
  navlinks.forEach((o) => {
    if (o.subLinks) {
      o.subLinks.forEach((s) => {
        if (s.path.test(path)) {
          pageTitle = s.name;
        }
      });
    }
    if (!pageTitle && o.path.test(path)) {
      pageTitle = o.name;
    }
  });

  let customStyles = ``;
  if (settings?.customized) {
    const textColor =
      backgroundShade(settings?.primaryColor) === "dark" ? "#fff" : "#444";

    // we could support saving this CSS in the settings so it can be customized
    customStyles = `
      .sidebar { background-color: ${settings.primaryColor} !important; transition: none }
      .sidebarlink { transition: none; } 
      .sidebarlink:hover {
        background-color: background-color: ${settings.secondaryColor} !important;
      }
      .sidebarlink a:hover, .sidebarlink.selected, .sublink.selected { background-color: ${settings.secondaryColor} !important; } 
      .sublink {border-color: ${settings.secondaryColor} !important; }
      .sublink:hover, .sublink:hover a { background-color: ${settings.secondaryColor} !important; }
      .sidebarlink a, .sublink a {color: ${textColor}}
      `;
  }

  return (
    <>
      {settings?.customized && (
        <style dangerouslySetInnerHTML={{ __html: customStyles }}></style>
      )}
      <div
        className={clsx(styles.sidebar, "sidebar mb-5", {
          [styles.sidebaropen]: open,
        })}
      >
        <div className="">
          <div className="app-sidebar-header">
            <div className="app-sidebar-logo">
              <Link href="/">
                <a
                  aria-current="page"
                  className="app-sidebar-logo active"
                  title="GrowthBook Home"
                  onClick={() => setOpen(false)}
                >
                  <div className={styles.sidebarlogo}>
                    {settings?.customized && settings?.logoPath ? (
                      <>
                        <img
                          className={styles.userlogo}
                          alt="GrowthBook"
                          src={settings.logoPath}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          className={styles.logo}
                          alt="GrowthBook"
                          src="/logo/growth-book-logomark-white.svg"
                        />
                        <img
                          className={styles.logotext}
                          alt="GrowthBook"
                          src="/logo/growth-book-name-white.svg"
                        />
                      </>
                    )}
                  </div>
                </a>
              </Link>
            </div>
            <div className={styles.mainmenu}>
              <ul
                onClick={(e) => {
                  const t = (e.target as HTMLElement).closest("a");
                  if (t && t.href && !t.className.match(/no-close/)) {
                    setOpen(false);
                  }
                }}
              >
                <li>
                  <a
                    href="#"
                    className={`${styles.closebutton} closebutton`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg
                      className="bi bi-x"
                      width="1.9em"
                      height="1.9em"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
                      />
                    </svg>
                  </a>
                </li>
                <ProjectSelector />
                {navlinks.map((v, i) => (
                  <SidebarLink {...v} key={i} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="p-3">
          <a
            href="https://docs.growthbook.io"
            className="btn btn-outline-light btn-block"
            target="_blank"
            rel="noreferrer"
          >
            View Docs <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>

      <TopNav
        pageTitle={pageTitle}
        showNotices={true}
        toggleLeftMenu={() => setOpen(!open)}
      />
    </>
  );
};

export default Layout;
