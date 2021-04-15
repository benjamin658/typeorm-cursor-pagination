export function atob(value: string): string {
  return Buffer.from(value, 'base64').toString();
}

export function btoa(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function encodeByType(type: string, value: any): string | null {
  if (value === null) return null;

  switch (type) {
    case 'date': {
      return (value as Date).getTime().toString();
    }
    case 'number': {
      return `${value}`;
    }
    case 'string': {
      return encodeURIComponent(value);
    }
    case 'object': {
      /**
       * if reflection type is Object, check whether an object is a date.
       * see: https://github.com/rbuckton/reflect-metadata/issues/84
       */
      if (typeof value.getTime === 'function') {
        return (value as Date).getTime().toString();
      }

      break;
    }
    default: break;
  }

  throw new Error(`unknown type in cursor: [${type}]${value}`);
}

export function decodeByType(type: string, value: string): string | number | Date {
  switch (type) {
    case 'object':
    case 'date': {
      const timestamp = parseInt(value, 10);

      if (Number.isNaN(timestamp)) {
        throw new Error('date column in cursor should be a valid timestamp');
      }

      return new Date(timestamp);
    }

    case 'number': {
      const num = parseInt(value, 10);

      if (Number.isNaN(num)) {
        throw new Error('number column in cursor should be a valid number');
      }

      return num;
    }

    case 'string': {
      return decodeURIComponent(value);
    }

    default: {
      throw new Error(`unknown type in cursor: [${type}]${value}`);
    }
  }
}

export function stringToBool(value: string): boolean {
  return value === 'true';
}

export function stringToNumber(value: string): number {
  const result = parseInt(value, 10);

  if (Number.isNaN(result)) {
    return 0;
  }

  return result;
}

export function camelOrPascalToUnderscore(str: string): string {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export function pascalToUnderscore(str: string): string {
  return camelOrPascalToUnderscore(str);
}
