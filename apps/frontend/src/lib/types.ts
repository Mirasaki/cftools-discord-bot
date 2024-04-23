export type NavItem = {
  label: string;
  href: string;
  enabled: boolean;
};

export type Config = {
  /**
   * The runtime for this app. This determines the environment in which the app
   * will run, and can affect the performance and capabilities of the app. If
   * you're hosted on a server, you should use `nodejs`. If you're hosted on a
   * serverless platform, you should use `edge`.
   */
  runtime: 'nodejs' | 'edge';
  /**
   * The theme color for this app. This color is used by the browser to
   * customize the appearance of the browser's UI elements, and is used
   * throughout the app to provide a consistent color scheme.
   * 
   * Note: This determines the color of link/URL previews on various platforms.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color
   * 
   * @default "#5789f6"
   */
  themeColor: string;
  /**
   * The URL to the logo for this app. This logo is used by the browser
   * to display the logo in the browser's UI elements, and is used throughout
   * the app to provide a consistent branding.
   */
  logoURL: string;
  site: {
    /** The URL where the app is hosted. */
    url: string;
    /**
     * The title of the app.
     */
    title: string;
    /**
     * The template to use for the title of each page in the app.
     * 
     * @default "%s | %s"
     */
    titleTemplate?: string;
    /**
     * The metadata for the app. Social media sharing platforms use this
     * information to display a preview of the app, and is vital for SEO.
     */
    twitter?: {
      site?: string;
      creator?: string;
      card?: 'summary' | 'summary_large_image' | 'app' | 'player';
      images?: {
        url: string;
        alt: string;
      }[];
    };
  };
  /**
   * The metadata for each page in the app. Social media sharing
   * platforms use this information to display a preview of the page,
   * and is vital for SEO.
   */
  pages: {
    home: {
      title: string;
      description: string;
      sections: {
        network: {
          title: string;
          description: string;
        };
        about: {
          title: string;
          description: string;
          rows: {
            1: {
              title: string;
              description: string;
              image: {
                url: string;
                alt: string;
              };
            };
            2: {
              title: string;
              description: string;
              image: {
                url: string;
                alt: string;
              };
            };
            3: {
              title: string;
              description: string;
              image: {
                url: string;
                alt: string;
              };
            };
          }
        };
        leaderboard: {
          title: string;
          description: string;
        };
        contact: {
          title: string;
          description: string;
          links: {
            [key: string]: string;
          };
        };
      }
    };
  };
  /** Navigation items for the app. */
  navigation?: {
    items: NavItem[];
  };
  hero: {
    title: string;
    description: string;
    background: {
      /** The color for the background. */
      color: string;
      image: {
        /** The URL for the background image. */
        url: string;
        /** The alt text for the background image. */
        alt: string;
      };
    };
    cta: {
      /** The label for the call to action button. */
      label: string;
      /** The URL for the call to action button. */
      href: string;
    };
  };
  servers: {
    /** The public facing name of the server. */
    name: string;
    /** The IPv4 address of the server. */
    ipv4: string;
    /**
     * The port of the server
     * 
     * @default 2302
     */
    gamePort: number;
    /**
     * The Steam query port of the server
     * 
     * @default 27016
     */
    steamQueryPort: number;
    /**
     * The CFTools API ID for the server. This is used to fetch data from the CFTools API.
     * 
     * @see https://wiki.mirasaki.dev/docs/cftools-server-api-id
     */
    cftoolsApiId?: string;
  }[];
  cftools: {
    leaderboard: {
      /** Should the leaderboard section be enabled? */
      enabled: boolean;
      /** The default sort value for the leaderboard. */
      defaultSortValue: LeaderboardSortValues;
      /** The allowed sort values for the leaderboard. */
      allowedSortValues: LeaderboardSortValues[];
      /** The CFTools IDs to blacklist from the leaderboard, these will not be shown. */
      blacklistedCFToolsIds: string[];
      /** The amount of entries to show on the leaderboard. */
      showAmount: number;
    };
  };
  footer: {
    /** The trademark notice for the app. */
    trademarkNotice: string;
    /** The branding name for the app. */
    brandingName?: string;
    /** The URL for the branding name. */
    brandingURL?: string;
    /** The year copyright was established. */
    initialCopyrightYear?: number;
    /** The legal entity that owns the copyright. */
    copyrightBrandName?: string;
    /** The URL for the legal entity that owns the copyright. */
    copyrightBrandUrl?: string;
    /** The links for the footer, these can go anywhere. */
    links?: {
      url: string;
      label: string;
      openInNewTab?: boolean;
    }[];
  };
};

export type LeaderboardSortValues = 'kills' | 'deaths' | 'suicides' | 'playtime' | 'longest_kill' | 'longest_shot' | 'kdratio';
