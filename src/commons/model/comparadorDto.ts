export class ComparadorDto {
    constructor(public value: string) {
    }

    public static contains(): ComparadorDto {
        return new ComparadorDto("Contains");
    }

    public static startsWith(): ComparadorDto {
        return new ComparadorDto("StartsWith");
    }

    public static equal(): ComparadorDto {
        return new ComparadorDto("==");
    }

    public static biggerThen(): ComparadorDto {
        return new ComparadorDto(">");
    }

     public static biggerOrEqual(): ComparadorDto {
        return new ComparadorDto(">=");
    }

    public static lessThan(): ComparadorDto {
        return new ComparadorDto("<");
    }

    public static lessOrEqual(): ComparadorDto {
        return new ComparadorDto("<");
    }
}