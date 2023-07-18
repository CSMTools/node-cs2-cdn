import fs from 'fs';

type Data<T> = {
    [key: string]: T
}

export default class Store<T> {
    data: Data<T>;
    path: string;

    constructor(path: string) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        
        this.path = path;
        this.data = JSON.parse(fs.readFileSync(path).toString());

        if (process.platform === 'win32' || process.platform === 'linux' || process.platform === 'darwin') {
            fs.watch(path, async () => this.data = await this.#readIn());
        } else {
            fs.watchFile(path, async () => this.data = await this.#readIn());
        }
    }

    getValue(key: string) {
        return this.data[key];
    }

    setValue(key: string, value: T) {
        this.data[key] = value;

        this.#save();
    }

    #save() {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    #readIn(): Promise<Data<T>> {
        return new Promise((resolve, reject) => {
            // ReadFileSync is too unstable in this situation
            fs.readFile(this.path, (err, data) => {
                if (err) {
                    return console.log(err);
                }

                const file = data.toString();

                if (!file) {
                    return;
                }
    
                resolve(JSON.parse(file))
            })
        })    
    }
} 