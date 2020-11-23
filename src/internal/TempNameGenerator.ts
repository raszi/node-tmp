
import Configuration from './Configuration';
import PathUtils from './PathUtils';
import RandomNameGenerator from './RandomNameGenerator';
import StringUtils from './StringUtils';

export default class TempNameGenerator {

    private _nameGenerator: RandomNameGenerator = new RandomNameGenerator();

    public generate(configuration: Configuration): string {
        const root = PathUtils.resolvePath(configuration.dir, configuration.tmpdir);
        if (!StringUtils.isBlank(configuration.name)) {
            const result = PathUtils.resolvePath(configuration.name, root);
            if (!PathUtils.exists(result)) {
                return result;
            }
            throw new Error(`temporary object '${result}' already exists.`);
        } else if (!StringUtils.isBlank(configuration.template)) {
            let tries: number = configuration.tries;
            while (tries-- > 0) {
                const result = PathUtils.resolvePath(StringUtils.nameFromTemplate(
                    Configuration.TEMPLATE_REGEXP, configuration.template,
                    this._nameGenerator.generate(configuration.length)), root);
                if (!PathUtils.exists(result)) {
                    return result;
                }
            }
            throw new Error(`retry limit of ${configuration.tries} reached when trying to create temporary object for template '${configuration.template}'.`);
        } else {
            let tries: number = configuration.tries;
            while (tries-- > 0) {
                const result = PathUtils.resolvePath(StringUtils.nameFromComponents(
                    configuration.prefix, this._nameGenerator.generate(configuration.length),
                    configuration.postfix), root);
                if (!PathUtils.exists(result)) {
                    return result;
                }
            }
            throw new Error(`retry limit of ${configuration.tries} reached when trying to create temporary object.`);
        }
    }
}
