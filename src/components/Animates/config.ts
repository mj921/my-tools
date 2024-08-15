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
