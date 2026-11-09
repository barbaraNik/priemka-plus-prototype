const BUTTON_BASE =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2';

export const PRIMARY_BUTTON_CLASSES = `${BUTTON_BASE} bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500`;

export const SECONDARY_BUTTON_CLASSES = `${BUTTON_BASE} cursor-pointer border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50`;
