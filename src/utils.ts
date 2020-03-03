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
      return (value as number).toString();
    }
    case 'string': {
      return encodeURIComponent(value);
    }
    default: {
      throw new Error(`unknown type in cursor: [${type}]${value}`);
    }
  }
}

export function decodeByType(type: string, value: string): string | number | Date {
  switch (type) {
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

export function camelToUnderscore(str: string): string {
  return camelOrPascalToUnderscore(str);
}

export function pascalToUnderscore(str: string): string {
  return camelOrPascalToUnderscore(str);
}
