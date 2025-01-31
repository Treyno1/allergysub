interface LogData {
  [key: string]: any;
}

const createLogMessage = (componentName: string, action: string, data: LogData = {}) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    component: componentName,
    action,
    ...data
  };
};

export const logComponentInit = (componentName: string, data: LogData = {}) => {
  console.log(createLogMessage(componentName, 'Component initialized', data));
};

export const logImageFallback = (
  componentName: string, 
  imageUrl: string | null, 
  substituteName: string,
  reason: 'error' | 'missing'
) => {
  console.warn(createLogMessage(componentName, 'Image fallback used', {
    imageUrl,
    substituteName,
    reason,
    fallbackType: 'svg-placeholder'
  }));
};

export const logImageHandling = (
  componentName: string,
  status: 'loading' | 'loaded' | 'error',
  data: { imageUrl: string | null; substituteName: string; [key: string]: any }
) => {
  const level = status === 'error' ? console.error : console.log;
  level(createLogMessage(componentName, `Image ${status}`, data));
};

export const logDietaryRestrictions = (
  componentName: string,
  data: {
    substituteId: string;
    substituteName: string;
    restrictions: string[];
    [key: string]: any;
  }
) => {
  console.log(createLogMessage(componentName, 'Dietary restrictions processed', {
    restrictionsCount: data.restrictions.length,
    ...data
  }));
};

export const logCategorySelection = (
  componentName: string,
  data: {
    category: string;
    isSelected: boolean;
    totalSelected: number;
    [key: string]: any;
  }
) => {
  console.log(createLogMessage(componentName, 'Category selection changed', data));
};

export const logExpandCollapse = (
  componentName: string,
  data: {
    section: string;
    isExpanded: boolean;
    itemId: string;
    itemName: string;
  }
) => {
  console.log(createLogMessage(componentName, 'Section toggled', data));
};

export const logError = (
  componentName: string,
  error: Error,
  context: LogData = {}
) => {
  console.error(createLogMessage(componentName, 'Error occurred', {
    error: error.message,
    stack: error.stack,
    ...context
  }));
}; 