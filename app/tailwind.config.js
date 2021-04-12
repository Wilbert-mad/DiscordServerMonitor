module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      backgroundColor: theme => ({
        ...theme('colors'),
        primary: '#3490dc',
        secondary: '#ffed4a',
        danger: '#e3342f',
        backDrop: '#535656',
        dashboardbg: '#6A6A6A',
        dashboardMsg: '#C4C4C4',
      }),
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
      height: {
        msg: '100px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        none: 'none',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
