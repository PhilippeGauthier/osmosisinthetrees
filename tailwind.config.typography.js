//--------------------------------------------------------------------------
// Tailwind Typography configuration
//--------------------------------------------------------------------------
//
// Here you may overwrite the default Tailwind Typography (or prosé) styles or configure certain variants.
// More info: https://tailwindcss.com/docs/typography-plugin.
//

const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        "--tw-prose-body": theme("colors.white"),
                        "--tw-prose-headings": theme("colors.white"),
                        "--tw-prose-lead": theme("colors.white"),
                        "--tw-prose-links": theme("colors.white"),
                        "--tw-prose-bold": theme("colors.white"),
                        "--tw-prose-counters": theme("colors.white"),
                        "--tw-prose-bullets": theme("colors.white"),
                        "--tw-prose-hr": theme("colors.white"),
                        "--tw-prose-quotes": theme("colors.white"),
                        "--tw-prose-quote-borders": theme(
                            "colors.primary.DEFAULT / 1"
                        ),
                        "--tw-prose-captions": theme("colors.white"),
                        "--tw-prose-code": theme("colors.white"),
                        "--tw-prose-pre-code": theme("colors.white"),
                        "--tw-prose-pre-bg": theme("colors.white"),
                        "--tw-prose-th-borders": theme("colors.white"),
                        "--tw-prose-td-borders": theme("colors.white"),
                        "--tw-prose-invert-body": theme("colors.white"),
                        "--tw-prose-invert-headings": theme("colors.white"),
                        "--tw-prose-invert-lead": theme("colors.white"),
                        "--tw-prose-invert-links": theme("colors.white"),
                        "--tw-prose-invert-bold": theme("colors.white"),
                        "--tw-prose-invert-counters": theme("colors.white"),
                        "--tw-prose-invert-bullets": theme("colors.white"),
                        "--tw-prose-invert-hr": theme("colors.white"),
                        "--tw-prose-invert-quotes": theme("colors.white"),
                        "--tw-prose-invert-quote-borders":
                            theme("colors.white"),
                        "--tw-prose-invert-captions": theme("colors.white"),
                        "--tw-prose-invert-code": theme("colors.white"),
                        "--tw-prose-invert-pre-code": theme("colors.white"),
                        "--tw-prose-invert-pre-bg": theme("colors.white"),
                        "--tw-prose-invert-th-borders": theme("colors.white"),
                        "--tw-prose-invert-td-borders": theme("colors.white"),
                        lineHeight: "1.5em",
                        "ul > li > p, ol > li > p": {
                            marginTop: "0em !important",
                            marginBottom: "0em !important",
                            lineHeight: "1.5em",
                        },
                        ":where(.prose > div > :first-child)": {
                            marginTop: "0 !important",
                        },
                        ":where(.prose > div > :last-child)": {
                            marginBottom: "0 !important",
                        },
                    },
                },
                sm: {
                    css: {
                        lineHeight: "1.5em",
                        fontSize: "16px",
                    },
                },
                lg: {
                    css: {
                        lineHeight: "1.5em",
                    },
                },
                xl: {
                    css: {
                        lineHeight: "1.5em",
                    },
                },
                "2xl": {
                    css: {
                        lineHeight: "1.5em",
                    },
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/typography")({
            modifiers: [],
        }),
    ],
};
