export function atob(value: string): string {
  return Buffer.from(value, 'base64').toString();
}

export function btoa(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function encodeByType(type: string, value: any): string | null {
  if (type === null || value === null) return null;

  switch (type.toString()) {
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
      const date = new Date(value);
      if (date && date.getFullYear() > 2017 && date.getFullYear() < 2100) {
        return date.getTime().toString();
      }
      if (!Number.isNaN(parseInt(value, 10))) {
        return `${value}`;
      }
      throw new Error(`unknown object in cursor: ${JSON.stringify(value)}`);
    }
    default: {
      throw new Error(`unknown type in cursor: [${type}]${value}`);
    }
  }
}

export function decodeByType(type: string, value: string): string | number | Date | null {
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

    case 'object': {
      if (String(value) === 'null') {
        return null;
      }
      const num = parseInt(value, 10);
      if (!Number.isNaN(num)) {
        const date = new Date(num);
        if (date?.getFullYear() > 2017 && date?.getFullYear() < 2100) {
          return date;
        }
        return num;
      }
      throw new Error(`unknown object in cursor: [${type}]${value}`);
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
