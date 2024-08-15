export const animateConfig = {
  basic: [
    {
      name: 'scale-up',
      children: [
        'scale-up-center',
        'scale-up-top',
        'scale-up-tr',
        'scale-up-right',
        'scale-up-br',
        'scale-up-bottom',
        'scale-up-bl',
        'scale-up-left',
        'scale-up-tl',
        'scale-up-hor-center',
        'scale-up-hor-left',
        'scale-up-hor-right',
        'scale-up-ver-center',
        'scale-up-ver-top',
        'scale-up-ver-bottom',
      ],
    },
    {
      name: 'scale-down',
      children: [
        'scale-down-center',
        'scale-down-top',
        'scale-down-tr',
        'scale-down-right',
        'scale-down-br',
        'scale-down-bottom',
        'scale-down-bl',
        'scale-down-left',
        'scale-down-tl',
        'scale-down-hor-center',
        'scale-down-hor-left',
        'scale-down-hor-right',
        'scale-down-ver-center',
        'scale-down-ver-top',
        'scale-down-ver-bottom',
      ],
    },
    {
      name: 'rotate',
      children: [
        'rotate-center',
        'rotate-top',
        'rotate-tr',
        'rotate-right',
        'rotate-br',
        'rotate-bottom',
        'rotate-bl',
        'rotate-left',
        'rotate-tl',
        'rotate-hor-center',
        'rotate-hor-top',
        'rotate-hor-bottom',
        'rotate-vert-center',
        'rotate-vert-left',
        'rotate-vert-right',
        'rotate-diagonal-1',
        'rotate-diagonal-2',
        'rotate-diagonal-tr',
        'rotate-diagonal-br',
        'rotate-diagonal-bl',
        'rotate-diagonal-tl',
      ],
    },
    {
      name: 'rotate-scale',
      children: [
        'rotate-scale-up',
        'rotate-scale-down',
        'rotate-scale-up-hor',
        'rotate-scale-down-hor',
        'rotate-scale-up-ver',
        'rotate-scale-down-ver',
        'rotate-scale-up-diag-1',
        'rotate-scale-down-diag-1',
        'rotate-scale-up-diag-2',
        'rotate-scale-down-diag-2',
      ],
    },
    {
      name: 'rotate-90',
      children: [
        'rotate-90-cw',
        'rotate-90-ccw',
        'rotate-90-top-cw',
        'rotate-90-top-ccw',
        'rotate-90-tr-cw',
        'rotate-90-tr-ccw',
        'rotate-90-right-cw',
        'rotate-90-right-ccw',
        'rotate-90-br-cw',
        'rotate-90-br-ccw',
        'rotate-90-bottom-cw',
        'rotate-90-bottom-ccw',
        'rotate-90-bl-cw',
        'rotate-90-bl-ccw',
        'rotate-90-left-cw',
        'rotate-90-left-ccw',
        'rotate-90-tl-cw',
        'rotate-90-tl-ccw',
        'rotate-90-horizontal-fwd',
        'rotate-90-horizontal-bck',
        'rotate-90-vertical-fwd',
        'rotate-90-vertical-bck',
      ],
    },
    {
      name: 'flip',
      children: [
        'flip-horizontal-bottom',
        'flip-horizontal-top',
        'flip-horizontal-bck',
        'flip-horizontal-fwd',
        'flip-vertical-right',
        'flip-vertical-left',
        'flip-vertical-bck',
        'flip-vertical-fwd',
        'flip-diagonal-1-tr',
        'flip-diagonal-1-bl',
        'flip-diagonal-1-bck',
        'flip-diagonal-1-fwd',
        'flip-diagonal-2-br',
        'flip-diagonal-2-tl',
        'flip-diagonal-2-bck',
        'flip-diagonal-2-fwd',
      ],
    },
    {
      name: 'flip-2',
      children: [
        'flip-2-hor-top-1',
        'flip-2-hor-top-2',
        'flip-2-hor-top-bck',
        'flip-2-hor-top-fwd',
        'flip-2-ver-right-1',
        'flip-2-ver-right-2',
        'flip-2-ver-right-bck',
        'flip-2-ver-right-fwd',
        'flip-2-hor-bottom-1',
        'flip-2-hor-bottom-2',
        'flip-2-hor-bottom-bck',
        'flip-2-hor-bottom-fwd',
        'flip-2-ver-left-1',
        'flip-2-ver-left-2',
        'flip-2-ver-left-bck',
        'flip-2-ver-left-fwd',
      ],
    },
    {
      name: 'flip-scale',
      children: [
        'flip-scale-up-hor',
        'flip-scale-down-hor',
        'flip-scale-up-ver',
        'flip-scale-down-ver',
        'flip-scale-up-diag-1',
        'flip-scale-down-diag-1',
        'flip-scale-up-diag-2',
        'flip-scale-down-diag-2',
      ],
    },
    {
      name: 'flip-scale-2',
      children: [
        'flip-scale-2-hor-top',
        'flip-scale-2-ver-right',
        'flip-scale-2-hor-bottom',
        'flip-scale-2-ver-left',
      ],
    },
    {
      name: 'swing',
      children: [
        'swing-top-fwd',
        'swing-top-bck',
        'swing-top-right-fwd',
        'swing-top-right-bck',
        'swing-right-fwd',
        'swing-right-bck',
        'swing-bottom-right-fwd',
        'swing-bottom-right-bck',
        'swing-bottom-fwd',
        'swing-bottom-bck',
        'swing-bottom-left-fwd',
        'swing-bottom-left-bck',
        'swing-left-fwd',
        'swing-left-bck',
        'swing-top-left-fwd',
        'swing-top-left-bck',
      ],
    },
    {
      name: 'slide',
      children: [
        'slide-top',
        'slide-tr',
        'slide-right',
        'slide-br',
        'slide-bottom',
        'slide-bl',
        'slide-left',
        'slide-tl',
      ],
    },
    {
      name: 'slide-bck',
      children: [
        'slide-bck-center',
        'slide-bck-top',
        'slide-bck-tr',
        'slide-bck-right',
        'slide-bck-br',
        'slide-bck-bottom',
        'slide-bck-bl',
        'slide-bck-left',
        'slide-bck-tl',
      ],
    },
    {
      name: 'slide-fwd',
      children: [
        'slide-fwd-center',
        'slide-fwd-top',
        'slide-fwd-tr',
        'slide-fwd-right',
        'slide-fwd-br',
        'slide-fwd-bottom',
        'slide-fwd-bl',
        'slide-fwd-left',
        'slide-fwd-tl',
      ],
    },
    {
      name: 'slide-rotate',
      children: [
        'slide-rotate-hor-top',
        'slide-rotate-hor-t-bck',
        'slide-rotate-hor-t-fwd',
        'slide-rotate-ver-right',
        'slide-rotate-ver-r-bck',
        'slide-rotate-ver-r-fwd',
        'slide-rotate-hor-bottom',
        'slide-rotate-hor-b-bck',
        'slide-rotate-hor-b-fwd',
        'slide-rotate-ver-left',
        'slide-rotate-ver-l-bck',
        'slide-rotate-ver-l-fwd',
      ],
    },
    {
      name: 'shadow-drop',
      children: [
        'shadow-drop-center',
        'shadow-drop-top',
        'shadow-drop-right',
        'shadow-drop-bottom',
        'shadow-drop-left',
        'shadow-drop-lr',
        'shadow-drop-tb',
        'shadow-drop-tr',
        'shadow-drop-br',
        'shadow-drop-bl',
        'shadow-drop-tl',
      ],
    },
    {
      name: 'shadow-drop-2',
      children: [
        'shadow-drop-2-center',
        'shadow-drop-2-top',
        'shadow-drop-2-right',
        'shadow-drop-2-bottom',
        'shadow-drop-2-left',
        'shadow-drop-2-lr',
        'shadow-drop-2-tb',
        'shadow-drop-2-tr',
        'shadow-drop-2-br',
        'shadow-drop-2-bl',
        'shadow-drop-2-tl',
      ],
    },
    {
      name: 'shadow-pop',
      children: ['shadow-pop-tr', 'shadow-pop-br', 'shadow-pop-bl', 'shadow-pop-tl'],
    },
    {
      name: 'shadow-inset',
      children: [
        'shadow-inset-center',
        'shadow-inset-top',
        'shadow-inset-right',
        'shadow-inset-bottom',
        'shadow-inset-left',
        'shadow-inset-lr',
        'shadow-inset-tb',
        'shadow-inset-tr',
        'shadow-inset-br',
        'shadow-inset-bl',
        'shadow-inset-tl',
      ],
    },
  ],
  entrances: [
    {
      name: 'scale-in',
      children: [
        'scale-in-center',
        'scale-in-top',
        'scale-in-tr',
        'scale-in-right',
        'scale-in-br',
        'scale-in-bottom',
        'scale-in-bl',
        'scale-in-left',
        'scale-in-tl',
        'scale-in-hor-center',
        'scale-in-hor-left',
        'scale-in-hor-right',
        'scale-in-ver-center',
        'scale-in-ver-top',
        'scale-in-ver-bottom',
      ],
    },
    {
      name: 'rotate-in',
      children: [
        'rotate-in-center',
        'rotate-in-top',
        'rotate-in-tr',
        'rotate-in-right',
        'rotate-in-br',
        'rotate-in-bottom',
        'rotate-in-bl',
        'rotate-in-left',
        'rotate-in-tl',
        'rotate-in-hor',
        'rotate-in-ver',
        'rotate-in-diag-1',
        'rotate-in-diag-2',
      ],
    },
    {
      name: 'rotate-in-2',
      children: [
        'rotate-in-2-cw',
        'rotate-in-2-ccw',
        'rotate-in-2-fwd-cw',
        'rotate-in-2-fwd-ccw',
        'rotate-in-2-bck-cw',
        'rotate-in-2-bck-ccw',
        'rotate-in-2-tr-cw',
        'rotate-in-2-tr-ccw',
        'rotate-in-2-br-cw',
        'rotate-in-2-br-ccw',
        'rotate-in-2-bl-cw',
        'rotate-in-2-bl-ccw',
        'rotate-in-2-tl-cw',
        'rotate-in-2-tl-ccw',
      ],
    },
    {
      name: 'swirl-in',
      children: [
        'swirl-in-fwd',
        'swirl-in-bck',
        'swirl-in-top-fwd',
        'swirl-in-top-bck',
        'swirl-in-tr-fwd',
        'swirl-in-tr-bck',
        'swirl-in-right-fwd',
        'swirl-in-right-bck',
        'swirl-in-br-fwd',
        'swirl-in-br-bck',
        'swirl-in-bottom-fwd',
        'swirl-in-bottom-bck',
        'swirl-in-bl-fwd',
        'swirl-in-bl-bck',
        'swirl-in-left-fwd',
        'swirl-in-left-bck',
        'swirl-in-tl-fwd',
        'swirl-in-tl-bck',
      ],
    },
    {
      name: 'flip-in',
      children: [
        'flip-in-hor-bottom',
        'flip-in-hor-top',
        'flip-in-ver-right',
        'flip-in-ver-left',
        'flip-in-diag-1-tr',
        'flip-in-diag-1-bl',
        'flip-in-diag-2-tl',
        'flip-in-diag-2-br',
      ],
    },
    {
      name: 'slit-in',
      children: [
        'slit-in-vertical',
        'slit-in-horizontal',
        'slit-in-diagonal-1',
        'slit-in-diagonal-2',
      ],
    },
    {
      name: 'slide-in',
      children: [
        'slide-in-top',
        'slide-in-tr',
        'slide-in-right',
        'slide-in-br',
        'slide-in-bottom',
        'slide-in-bl',
        'slide-in-left',
        'slide-in-tl',
      ],
    },
    {
      name: 'slide-in-fwd',
      children: [
        'slide-in-fwd-center',
        'slide-in-fwd-top',
        'slide-in-fwd-tr',
        'slide-in-fwd-right',
        'slide-in-fwd-br',
        'slide-in-fwd-bottom',
        'slide-in-fwd-bl',
        'slide-in-fwd-left',
        'slide-in-fwd-tl',
      ],
    },
    {
      name: 'slide-in-bck',
      children: [
        'slide-in-bck-center',
        'slide-in-bck-top',
        'slide-in-bck-tr',
        'slide-in-bck-right',
        'slide-in-bck-br',
        'slide-in-bck-bottom',
        'slide-in-bck-bl',
        'slide-in-bck-left',
        'slide-in-bck-tl',
      ],
    },
    {
      name: 'slide-in-blurred',
      children: [
        'slide-in-blurred-top',
        'slide-in-blurred-tr',
        'slide-in-blurred-right',
        'slide-in-blurred-br',
        'slide-in-blurred-bottom',
        'slide-in-blurred-bl',
        'slide-in-blurred-left',
        'slide-in-blurred-tl',
      ],
    },
    {
      name: 'slide-in-elliptic',
      children: [
        'slide-in-elliptic-top-fwd',
        'slide-in-elliptic-top-bck',
        'slide-in-elliptic-right-fwd',
        'slide-in-elliptic-right-bck',
        'slide-in-elliptic-bottom-fwd',
        'slide-in-elliptic-bottom-bck',
        'slide-in-elliptic-left-fwd',
        'slide-in-elliptic-left-bck',
      ],
    },
    {
      name: 'bounce-in',
      children: [
        'bounce-in-top',
        'bounce-in-right',
        'bounce-in-bottom',
        'bounce-in-left',
        'bounce-in-fwd',
        'bounce-in-bck',
      ],
    },
    {
      name: 'roll-in',
      children: ['roll-in-left', 'roll-in-top', 'roll-in-right', 'roll-in-bottom'],
    },
    {
      name: 'roll-in-blurred',
      children: [
        'roll-in-blurred-left',
        'roll-in-blurred-top',
        'roll-in-blurred-right',
        'roll-in-blurred-bottom',
      ],
    },
    {
      name: 'tilt-in',
      children: [
        'tilt-in-top-1',
        'tilt-in-top-2',
        'tilt-in-tr',
        'tilt-in-right-1',
        'tilt-in-right-2',
        'tilt-in-br',
        'tilt-in-bottom-1',
        'tilt-in-bottom-2',
        'tilt-in-bl',
        'tilt-in-left-1',
        'tilt-in-left-2',
        'tilt-in-tl',
      ],
    },
    {
      name: 'tilt-in-fwd',
      children: ['tilt-in-fwd-tr', 'tilt-in-fwd-br', 'tilt-in-fwd-bl', 'tilt-in-fwd-tl'],
    },
    {
      name: 'swing-in',
      children: [
        'swing-in-top-fwd',
        'swing-in-top-bck',
        'swing-in-right-fwd',
        'swing-in-right-bck',
        'swing-in-bottom-fwd',
        'swing-in-bottom-bck',
        'swing-in-left-fwd',
        'swing-in-left-bck',
      ],
    },
    {
      name: 'fade-in',
      children: [
        'fade-in',
        'fade-in-fwd',
        'fade-in-bck',
        'fade-in-top',
        'fade-in-tr',
        'fade-in-right',
        'fade-in-br',
        'fade-in-bottom',
        'fade-in-bl',
        'fade-in-left',
        'fade-in-tl',
      ],
    },
    {
      name: 'puff-in',
      children: [
        'puff-in-center',
        'puff-in-top',
        'puff-in-tr',
        'puff-in-right',
        'puff-in-br',
        'puff-in-bottom',
        'puff-in-bl',
        'puff-in-left',
        'puff-in-tl',
        'puff-in-hor',
        'puff-in-ver',
      ],
    },
    { name: 'flicker-in', children: ['flicker-in-1', 'flicker-in-2'] },
  ],
  exits: [
    {
      name: 'scale-out',
      children: [
        'scale-out-center',
        'scale-out-top',
        'scale-out-tr',
        'scale-out-right',
        'scale-out-br',
        'scale-out-bottom',
        'scale-out-bl',
        'scale-out-left',
        'scale-out-tl',
        'scale-out-horizontal',
        'scale-out-hor-left',
        'scale-out-hor-right',
        'scale-out-vertical',
        'scale-out-ver-top',
        'scale-out-ver-bottom',
      ],
    },
    {
      name: 'rotate-out',
      children: [
        'rotate-out-center',
        'rotate-out-top',
        'rotate-out-tr',
        'rotate-out-right',
        'rotate-out-br',
        'rotate-out-bottom',
        'rotate-out-bl',
        'rotate-out-left',
        'rotate-out-tl',
        'rotate-out-hor',
        'rotate-out-ver',
        'rotate-out-diag-1',
        'rotate-out-diag-2',
      ],
    },
    {
      name: 'rotate-out-2',
      children: [
        'rotate-out-2-cw',
        'rotate-out-2-ccw',
        'rotate-out-2-bck',
        'rotate-out-2-fwd',
        'rotate-out-2-tr-cw',
        'rotate-out-2-tr-ccw',
        'rotate-out-2-br-cw',
        'rotate-out-2-br-ccw',
        'rotate-out-2-bl-cw',
        'rotate-out-2-bl-ccw',
        'rotate-out-2-tl-cw',
        'rotate-out-2-tl-ccw',
      ],
    },
    {
      name: 'swirl-out',
      children: [
        'swirl-out-bck',
        'swirl-out-fwd',
        'swirl-out-top-bck',
        'swirl-out-top-fwd',
        'swirl-out-tr-bck',
        'swirl-out-tr-fwd',
        'swirl-out-right-bck',
        'swirl-out-right-fwd',
        'swirl-out-br-bck',
        'swirl-out-br-fwd',
        'swirl-out-bottom-bck',
        'swirl-out-bottom-fwd',
        'swirl-out-bl-bck',
        'swirl-out-bl-fwd',
        'swirl-out-left-bck',
        'swirl-out-left-fwd',
        'swirl-out-tl-bck',
        'swirl-out-tl-fwd',
      ],
    },
    {
      name: 'flip-out',
      children: [
        'flip-out-hor-top',
        'flip-out-hor-bottom',
        'flip-out-ver-left',
        'flip-out-ver-right',
        'flip-out-diag-1-tr',
        'flip-out-diag-1-bl',
        'flip-out-diag-2-tl',
        'flip-out-diag-2-br',
      ],
    },
    {
      name: 'slit-out',
      children: [
        'slit-out-vertical',
        'slit-out-horizontal',
        'slit-out-diagonal-1',
        'slit-out-diagonal-2',
      ],
    },
    {
      name: 'slide-out',
      children: [
        'slide-out-top',
        'slide-out-tr',
        'slide-out-right',
        'slide-out-br',
        'slide-out-bottom',
        'slide-out-bl',
        'slide-out-left',
        'slide-out-tl',
      ],
    },
    {
      name: 'slide-out-bck',
      children: [
        'slide-out-bck-center',
        'slide-out-bck-top',
        'slide-out-bck-tr',
        'slide-out-bck-right',
        'slide-out-bck-br',
        'slide-out-bck-bottom',
        'slide-out-bck-bl',
        'slide-out-bck-left',
        'slide-out-bck-tl',
      ],
    },
    {
      name: 'slide-out-fwd',
      children: [
        'slide-out-fwd-center',
        'slide-out-fwd-top',
        'slide-out-fwd-tr',
        'slide-out-fwd-right',
        'slide-out-fwd-br',
        'slide-out-fwd-bottom',
        'slide-out-fwd-bl',
        'slide-out-fwd-left',
        'slide-out-fwd-tl',
      ],
    },
    {
      name: 'slide-out-blurred',
      children: [
        'slide-out-blurred-top',
        'slide-out-blurred-tr',
        'slide-out-blurred-right',
        'slide-out-blurred-br',
        'slide-out-blurred-bottom',
        'slide-out-blurred-bl',
        'slide-out-blurred-left',
        'slide-out-blurred-tl',
      ],
    },
    {
      name: 'slide-out-elliptic',
      children: [
        'slide-out-elliptic-top-bck',
        'slide-out-elliptic-top-fwd',
        'slide-out-elliptic-right-bck',
        'slide-out-elliptic-right-fwd',
        'slide-out-elliptic-bottom-bck',
        'slide-out-elliptic-bottom-fwd',
        'slide-out-elliptic-left-bck',
        'slide-out-elliptic-left-fwd',
      ],
    },
    {
      name: 'bounce-out',
      children: [
        'bounce-out-top',
        'bounce-out-right',
        'bounce-out-bottom',
        'bounce-out-left',
        'bounce-out-bck',
        'bounce-out-fwd',
      ],
    },
    {
      name: 'roll-out',
      children: ['roll-out-left', 'roll-out-top', 'roll-out-right', 'roll-out-bottom'],
    },
    {
      name: 'roll-out-blurred',
      children: [
        'roll-out-blurred-left',
        'roll-out-blurred-top',
        'roll-out-blurred-right',
        'roll-out-blurred-bottom',
      ],
    },
    {
      name: 'swing-out',
      children: [
        'swing-out-top-bck',
        'swing-out-top-fwd',
        'swing-out-right-bck',
        'swing-out-right-fwd',
        'swing-out-bottom-bck',
        'swing-out-bottom-fwd',
        'swing-out-left-bck',
        'swing-out-left-fwd',
      ],
    },
    {
      name: 'fade-out',
      children: [
        'fade-out',
        'fade-out-bck',
        'fade-out-fwd',
        'fade-out-top',
        'fade-out-tr',
        'fade-out-right',
        'fade-out-br',
        'fade-out-bottom',
        'fade-out-bl',
        'fade-out-left',
        'fade-out-tl',
      ],
    },
    {
      name: 'puff-out',
      children: [
        'puff-out-center',
        'puff-out-top',
        'puff-out-tr',
        'puff-out-right',
        'puff-out-br',
        'puff-out-bottom',
        'puff-out-bl',
        'puff-out-left',
        'puff-out-tl',
        'puff-out-hor',
        'puff-out-ver',
      ],
    },
    { name: 'flicker-out', children: ['flicker-out-1', 'flicker-out-2'] },
  ],
  text: [
    {
      name: 'tracking-in',
      children: [
        'tracking-in-expand',
        'tracking-in-expand-fwd',
        'tracking-in-expand-fwd-top',
        'tracking-in-expand-fwd-bottom',
        'tracking-in-contract',
        'tracking-in-contract-bck',
        'tracking-in-contract-bck-top',
        'tracking-in-contract-bck-bottom',
      ],
    },
    {
      name: 'tracking-out',
      children: [
        'tracking-out-contract',
        'tracking-out-contract-bck',
        'tracking-out-contract-bck-top',
        'tracking-out-contract-bck-bottom',
        'tracking-out-expand',
        'tracking-out-expand-fwd',
        'tracking-out-expand-fwd-top',
        'tracking-out-expand-fwd-bottom',
      ],
    },
    {
      name: 'focus-in',
      children: [
        'text-focus-in',
        'focus-in-expand',
        'focus-in-expand-fwd',
        'focus-in-contract',
        'focus-in-contract-bck',
      ],
    },
    {
      name: 'blur-out',
      children: [
        'text-blur-out',
        'blur-out-contract',
        'blur-out-contract-bck',
        'blur-out-expand',
        'blur-out-expand-fwd',
      ],
    },
    { name: 'flicker', children: ['text-flicker-in-glow', 'text-flicker-out-glow'] },
    {
      name: 'shadow-drop',
      children: [
        'text-shadow-drop-center',
        'text-shadow-drop-top',
        'text-shadow-drop-tr',
        'text-shadow-drop-right',
        'text-shadow-drop-br',
        'text-shadow-drop-bottom',
        'text-shadow-drop-bl',
        'text-shadow-drop-left',
        'text-shadow-drop-tl',
      ],
    },
    {
      name: 'shadow-pop',
      children: [
        'text-shadow-pop-top',
        'text-shadow-pop-tr',
        'text-shadow-pop-right',
        'text-shadow-pop-br',
        'text-shadow-pop-bottom',
        'text-shadow-pop-bl',
        'text-shadow-pop-left',
        'text-shadow-pop-tl',
      ],
    },
    {
      name: 'pop-up',
      children: [
        'text-pop-up-top',
        'text-pop-up-tr',
        'text-pop-up-right',
        'text-pop-up-br',
        'text-pop-up-bottom',
        'text-pop-up-bl',
        'text-pop-up-left',
        'text-pop-up-tl',
      ],
    },
  ],
  attention: [
    { name: 'vibrate', children: ['vibrate-1', 'vibrate-2', 'vibrate-3'] },
    {
      name: 'flicker',
      children: ['flicker-1', 'flicker-2', 'flicker-3', 'flicker-4', 'flicker-5'],
    },
    {
      name: 'shake',
      children: [
        'shake-horizontal',
        'shake-vertical',
        'shake-lr',
        'shake-top',
        'shake-tr',
        'shake-right',
        'shake-br',
        'shake-bottom',
        'shake-bl',
        'shake-left',
        'shake-tl',
      ],
    },
    {
      name: 'jello',
      children: ['jello-horizontal', 'jello-vertical', 'jello-diagonal-1', 'jello-diagonal-2'],
    },
    {
      name: 'wobble',
      children: ['wobble-hor-bottom', 'wobble-hor-top', 'wobble-ver-left', 'wobble-ver-right'],
    },
    { name: 'bounce', children: ['bounce-top', 'bounce-bottom', 'bounce-left', 'bounce-right'] },
    { name: 'pulsate', children: ['heartbeat', 'pulsate-bck', 'pulsate-fwd', 'ping'] },
    { name: 'blink', children: ['blink-1', 'blink-2'] },
  ],
  background: [
    {
      name: 'ken-burns',
      children: [
        'kenburns-top',
        'kenburns-top-right',
        'kenburns-right',
        'kenburns-bottom-right',
        'kenburns-bottom',
        'kenburns-bottom-left',
        'kenburns-left',
        'kenburns-top-left',
      ],
    },
    {
      name: 'bg-pan',
      children: [
        'bg-pan-left',
        'bg-pan-right',
        'bg-pan-top',
        'bg-pan-bottom',
        'bg-pan-tr',
        'bg-pan-br',
        'bg-pan-bl',
        'bg-pan-tl',
      ],
    },
    {
      name: 'color-change',
      children: ['color-change-2x', 'color-change-3x', 'color-change-4x', 'color-change-5x'],
    },
  ],
};

export const timeFunctionOptions = [
  {
    isGroup: true,
    label: '原生',
    options: ['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut'],
  },
  {
    isGroup: true,
    label: 'Penner方程',
    options: [
      { value: 'ease', label: 'ease' },
      { value: 'ease-in', label: 'ease-in' },
      { value: 'ease-out', label: 'ease-out' },
      { value: 'ease-in-out', label: 'ease-in-out' },
      { value: 'linear', label: 'linear' },
      { value: 'ease-in', label: 'easeIn' },
      { value: 'ease-out', label: 'easeOut' },
      { value: 'ease-in-out', label: 'easeInOut' },
      { value: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)', label: 'easeInQuad' },
      { value: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)', label: 'easeInCubic' },
      { value: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)', label: 'easeInQuart' },
      { value: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)', label: 'easeInQuint' },
      { value: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)', label: 'easeInSine' },
      { value: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)', label: 'easeInExpo' },
      { value: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)', label: 'easeInCirc' },
      { value: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)', label: 'easeInBack' },
      { value: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', label: 'easeOutQuad' },
      { value: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', label: 'easeOutCubic' },
      { value: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', label: 'easeOutQuart' },
      { value: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', label: 'easeOutQuint' },
      { value: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)', label: 'easeOutSine' },
      { value: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)', label: 'easeOutExpo' },
      { value: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)', label: 'easeOutCirc' },
      { value: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)', label: 'easeOutBack' },
      { value: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)', label: 'easeInOutQuad' },
      { value: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)', label: 'easeInOutCubic' },
      { value: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)', label: 'easeInOutQuart' },
      { value: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)', label: 'easeInOutQuint' },
      { value: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)', label: 'easeInOutSine' },
      { value: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)', label: 'easeInOutExpo' },
      { value: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)', label: 'easeInOutCirc' },
      { value: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)', label: 'easeInOutBack' },
    ],
  },
];

export const directionOptions = ['normal', 'reverse', 'alternate', 'alternate-reverse'];

export const fillModeOptions = ['none', 'forwards', 'backwards', 'both'];
