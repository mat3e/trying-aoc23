`input here`.split('\n').map(txt => txt.replaceAll(/[A-Za-z]/g, '')).map(digitsOnly => +(digitsOnly[0] + digitsOnly[digitsOnly.length - 1])).reduce((sum, curr) => sum + curr, 0);
