import {PathNotFoundError, resolvePath, resolvePlaceholders} from "../../util/utils";

describe('resolvePath', () => {

    it('should return the value of the given path', () => {
        const value = resolvePath({a: {b: {c: 1}}}, 'a.b.c')

        expect(value).toEqual(1);
    });

    it('should throw an error if the path is not found', () => {
        expect(() => resolvePath({a: {b: {c: 1}}}, 'a.b.d')).toThrow(PathNotFoundError);
    });

    it('should throw an error if the path incorrect type', () => {
        expect(() => resolvePath({a: {b: 2}}, 'a.b.c')).toThrow(PathNotFoundError);
    });

});

describe('resolvePlaceholders', () => {

    it('should replace placeholders with values', () => {
        const context = {
            a: "alpha",
            b: "bravo",
            c: "${a}-${b}"
        }

        resolvePlaceholders(context);

        expect(context.c).toEqual("alpha-bravo");
    });

    it('should not replace placeholders with no value to replace', () => {
        const context = {
            a: "alpha",
            b: "bravo",
            c: "${a}-${d}"
        }

        resolvePlaceholders(context);

        expect(context.c).toEqual("alpha-${d}");
    });

    it('should not attempt to replace recursive placeholders', () => {
        const context = {
            a: "${c}",
            b: "bravo",
            c: "${a}"
        }

        expect(() => resolvePlaceholders(context)).toThrow(RangeError);
    });

    it('should resolve nested placeholders', () => {
        const context = {
            a: "alpha",
            b: "bravo",
            c: {
                name: "${a}-${b}"
            }
        }

        resolvePlaceholders(context);

        expect(context.c.name).toEqual("alpha-bravo");
    });
});