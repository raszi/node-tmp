import Configuration from './Configuration';
import {exists, resolvePath} from './PathUtils';
import RandomNameGenerator from './RandomNameGenerator';
import {isBlank, nameFromComponents, nameFromTemplate} from './StringUtils';

export default class TempNameGenerator {

    private _nameGenerator: RandomNameGenerator = new RandomNameGenerator();

    public generate(configuration: Configuration): string {
        const root = resolvePath(configuration.dir, configuration.tmpdir);
        if (!isBlank(configuration.name)) {
            const result = resolvePath(configuration.name, root);
            if (!exists(result)) {
                return result;
            }
            throw new Error(`temporary object '${result}' already exists.`);
        } else if (!isBlank(configuration.template)) {
            let tries: number = configuration.tries;
            while (tries-- > 0) {
                const result = resolvePath(nameFromTemplate(
                    Configuration.TEMPLATE_REGEXP, configuration.template,
                    this._nameGenerator.generate(configuration.length)), root);
                if (!exists(result)) {
                    return result;
                }
            }
            throw new Error(`retry limit of ${configuration.tries} reached when trying to create temporary object for template '${configuration.template}'.`);
        } else {
            let tries: number = configuration.tries;
            while (tries-- > 0) {
                const result = resolvePath(nameFromComponents(
                    configuration.prefix, this._nameGenerator.generate(configuration.length),
                    configuration.postfix), root);
                if (!exists(result)) {
                    return result;
                }
            }
            throw new Error(`retry limit of ${configuration.tries} reached when trying to create temporary object.`);
        }
    }
}
