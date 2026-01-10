export const saveReading = (reading) => {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = localStorage.getItem('readings');
    const readings = saved ? JSON.parse(saved) : [];
    
    const newReading = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...reading,
    };
    
    readings.unshift(newReading);
    localStorage.setItem('readings', JSON.stringify(readings));
    return newReading;
  } catch (error) {
    console.error('Failed to save reading:', error);
  }
};

export const getReadings = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('readings');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load readings:', error);
    return [];
  }
};

export const getReading = (id) => {
  const readings = getReadings();
  return readings.find(r => r.id === parseInt(id));
};

export const deleteReading = (id) => {
  if (typeof window === 'undefined') return;
  
  try {
    const readings = getReadings();
    const filtered = readings.filter(r => r.id !== parseInt(id));
    localStorage.setItem('readings', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete reading:', error);
  }
};
