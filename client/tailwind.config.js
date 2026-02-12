/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131'
      },
      listStyleType: {
        square: 'square',
        disc: 'disc',
        decimal: 'decimal',
        none: 'none',
        roman: 'upper-roman'
      },
      colors: {
        main: '#ee3131',
        overlay: 'rgb(0,0,0,0.3)'
      },
      fontFamily: {
        main: ['Poppins', 'sans-serif']
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      // Định nghĩa các bước chuyển động
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(0)',
            'transform': 'translateY(0)'
          },
          '100%': {
            '-webkit-transform': 'translateY(-10px)',
            'transform': 'translateY(-10px)'
          }
        },
        'scale-up-center': {
          '0%': {
            '-webkit-transform': 'scale(0.5)',
            'transform': 'scale(0.5)'
          },
          '100%': {
            '-webkit-transform': 'scale(1)',
            'transform': 'scale(1)'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(4px)',
            'transform': 'translateY(4px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            'transform': 'translateY(0px)'
          }
        },

        'slide-right': {
          '0%': {
            '-webkit-transform': 'translateX(-1000px)',
                    'transform': 'translateX(-1000px)'
          },
          '100%': {
            '-webkit-transform': 'translateX(0)',
                    'transform': 'translateX(0)'
          }
        }

      },
      // Định nghĩa tên class để gọi animation
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-top-sm': 'slide-top-sm 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'scale-up-center': 'scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      }
    },
  },
  plugins: [],
}