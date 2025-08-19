import { fnGetDelay } from "./delay";

abstract class clTestLab implements ifTestLab {
    store_docname: boolean;
    use_docname: string;
    connection: string;
    connection_doctype: string;
    linked_document: string;
    connection_from: string;

    constructor(
        store_docname: boolean,
        use_docname: string,
        connection: string,
        connection_doctype: string,
        linked_document: string,
        connection_from: string,
    ) {
        this.store_docname = store_docname;
        this.use_docname = use_docname;
        this.connection = connection;
        this.connection_doctype = connection_doctype;
        this.linked_document = linked_document;
        this.connection_from = connection_from;
    }
    abstract execute(): void;
}

class clReadConnection extends clTestLab {
    async execute(): Promise<void> {
        console.log(`Reading from ${this.connection_doctype} via ${this.connection}`);
        // logic for reading test_lab_script
    }
}

class clCreateConnection extends clTestLab {
    async execute(): Promise<void> {
        console.log(`Creating in ${this.connection_doctype} via ${this.connection}`);
        // logic for creating test_lab_script
    }
}

//  Test Lab Factory class 
export class clTestLabFactory {
    private static testLabMap: { [key: string]: new (...args: ConstructorParameters<typeof clTestLab>) => clTestLab } = {
        "Read": clReadConnection,
        "Create": clCreateConnection,
    };

    static create(type: string, ...args: ConstructorParameters<typeof clTestLab>): clTestLab {
        const Lclass = this.testLabMap[type];
        if (!Lclass) throw new Error(`Unknown creation type: ${type}`);
        return new Lclass(...args);
    }
}