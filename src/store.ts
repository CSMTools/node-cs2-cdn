import fs from 'fs';

export default class Store<T> {
    data: {
        [key: string]: T
    };
    path: string;

    constructor(path: string) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        
        this.data = JSON.parse(fs.readFileSync(path).toString());
        this.path = path;
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
} 