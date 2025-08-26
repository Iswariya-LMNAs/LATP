import { fnGetDelay } from "./delay";

abstract class clTestLab implements ifTestLab {
    store_docname: boolean;
    use_docname: string;
    connection: string;
    connection_doctype: string;
    linked_document: string;
    connection_from: string;

    static createdDocsByIndex: Record<number, string> = {};
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
    // Using Cypress.chainable type since this method perform series of commands
    abstract execute(script: TtestLabScript): Cypress.Chainable<string | null>;
}

class clReadConnection extends clTestLab {
    execute(script: TtestLabScript): Cypress.Chainable<Record<number, string>> {
        const { use_docname } = script;
        const docname = clTestLab.createdDocsByIndex[use_docname];

        if (!docname) {
            cy.log(`No created document found for idx ${use_docname}`);
            return cy.wrap(clTestLab.createdDocsByIndex);
        }

        cy.log(`Reading document ${docname} for idx ${use_docname}`);

        // return cy.visit(`/app/${script.connection_doctype}/${docname}`)
        //     .wait(fnGetDelay("medium"))
        //     .then(() => {
        //         return cy.wrap(clTestLab.createdDocsByIndex);
        //     });
        return cy.location("origin").then(origin => {
            const Ldoctype = script.connection_doctype.trim().toLowerCase().replace(/\s+/g, "-");
            let LfullUrl = `${origin}/app/${Ldoctype}/${docname}`
            cy.visit(LfullUrl)
            .wait(fnGetDelay("medium"))
            .then(() => {
                return cy.wrap(clTestLab.createdDocsByIndex);
            });
        });
    }
}

class clCreateConnection extends clTestLab {
    execute(script: TtestLabScript): Cypress.Chainable<Record<number, string>> {
        const { connection, connection_doctype, idx } = script;

        if (!connection_doctype) {
            cy.log("Missing connection_doctype, skipping.");
            return cy.wrap(clTestLab.createdDocsByIndex);
        }

        if (connection === "Create") {
            cy.log("Initiating connection creation from current document...");

            return cy.contains(".nav-item", "Connections", { timeout: 10000 })
                .should("be.visible")
                .click()
                .wait(fnGetDelay("medium"))
                .then(() => {
                    return cy.get(".form-dashboard", { timeout: 10000 }).within(() => {
                        return cy.contains(".document-link-badge", connection_doctype, { timeout: 10000 })
                            .should("be.visible")
                            .parents(".document-link")
                            .within(() => {
                                cy.get("button.btn-open-row, button.btn")
                                    .should("be.visible")
                                    .click({ force: true });
                            });
                    });
                })
                // .wait(30000)
                .then(() => {
                    return cy.contains("button", "Save")
                        .scrollIntoView()
                        .should("exist")
                        .click({ force: true })
                        .wait(3000)
                        .url()
                        .then((url: string) => {
                            const docname = url.split("/").pop() || null;
                            cy.log(`Created document: ${docname}`);

                            if (docname) {
                                script.linked_document = docname;
                                clTestLab.createdDocsByIndex[idx] = docname; // 🔑 shared dict
                            }

                            return cy.wrap(clTestLab.createdDocsByIndex);
                        });
                });
        }

        return cy.wrap(clTestLab.createdDocsByIndex);
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