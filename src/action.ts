import { clDataTypeFactory } from "./dataType";
import { clPropertiesFactory } from "./properties";
import { fnGetDelay } from "../src/delay";

/** @class clAction - Base abstract class for executing actions on data fields. */
//clAction base class which implements the ifHandler interface
abstract class clAction implements ifActionHandler {
    action: string;
    actionData: TTactionsData;
    dataType: ifDataType;
    actionRow: TactionData;
    fieldSlector: string;
    fieldProp: string;

    constructor(iAction: string, iaActionData: TTactionsData) {
        this.actionData = iaActionData;
        this.action = iAction;
    }
    checkFieldValue(): void {
        this.dataType.validate();
    }
    checkFieldProperties(): void {
        const LApropertyValidators = clPropertiesFactory.createAllFor(this);
        LApropertyValidators.forEach((ldValidator) => ldValidator.validate());  
    }    
    executeAction(): void {
    const LAgroupTab = this.actionData.reduce((LAacc, ldRow) => {
    const Ltab = ldRow.tab || " ";
      (LAacc[Ltab] ||= []).push(ldRow);
      return LAacc; 
    }, []);
    Object.entries(LAgroupTab).forEach(([lTabName, laRows]) => {
        if (lTabName !== " ") {
            const LOtabClick = clActionFactory.createAction("On Tab", [laRows[0]]);
            LOtabClick.executeAction();
        }
        laRows.forEach(ldRow => {
            if (!ldRow.data_type) return;
            this.actionRow = ldRow;
            this.dataType = clDataTypeFactory.createDataType(ldRow.data_type, this);
            this.checkFieldValue();
            this.checkFieldProperties();
            });
        });
    }
}
/** @class clActionExpandSection is extended class from the clAction*/
/* Expand Section class is used to expand the section mentioned in the configurator
*/ 
class clActionExpandSection extends clAction {
    constructor(iAction: string, iaActionData: TTactionsData) {
               super(iAction, iaActionData);
             }  
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const LOtabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            LOtabClick.executeAction();
        }
        const LsectionTitle = this.actionRow.section;
        if (!LsectionTitle) {
            return;
        }
        cy.get('.section-head').each(($el) => {
        const Ltext = Cypress.$($el).text().trim();
        if (Ltext === LsectionTitle) {
            const $parent = Cypress.$($el).parent();
            const LisCollapsed = $parent.find('.section-body').css('display') === 'none';
        if (LisCollapsed) {
            cy.wrap($el).wait(fnGetDelay("medium")).click({ force: true });} 
        }
        });
        this.actionData.forEach(ldRow => {
        if (!ldRow.data_type) return;
            this.actionRow = ldRow;
            this.dataType = clDataTypeFactory.createDataType(ldRow.data_type, this, ldRow);
            this.checkFieldValue();
            this.checkFieldProperties();
        });
     }                      
}

/** @class clActionOnLoad - Handles actions on page load. */
class clActionOnLoad extends clAction {
    executeAction(): void { super.executeAction()}
    checkFieldValue(): void { super.checkFieldValue(); }
    checkFieldProperties(): void { super.checkFieldProperties(); }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}
/** @class clActionOnChange - Handles actions like On Change */
class clActionOnChange extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {   
            const LOtabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            LOtabClick.executeAction();
        }
         if (this.actionRow.is_child) {
            const LOchildAction = new clActionOnChangeChild(this.action, this.actionData);
            LOchildAction.executeAction();
            return;
        }
        this.dataType = clDataTypeFactory.createDataType(this.actionRow.data_type, this);
        this.dataType.input();
        super.executeAction();
    }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}
class clActionOnChangeChild extends clActionOnChange{
   executeAction(): void {
    this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const LOtabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            LOtabClick.executeAction();
        }
        this.dataType = clDataTypeFactory.createDataType(this.actionRow.data_type, this);
        this.dataType.input();
        this.actionData.forEach(ldRow => {
            if (!ldRow.data_type) return;
            this.actionRow = ldRow;
            this.dataType = clDataTypeFactory.createDataType(ldRow.data_type, this, ldRow);
            this.checkFieldValue();
            this.checkFieldProperties();
        });
   }
}
class clActionAddRow extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if(this.actionRow.tab){
            const LOtabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            LOtabClick.executeAction();
        }
        cy.get(`[data-fieldname="${this.actionRow.child_name}"]`, { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .within(() => {
                cy.contains('button', 'Add Row', { matchCase: false })
                    .should('be.visible')
                    .click({ force: true });
            });
            this.actionData.forEach(ldRow => {
                if (!ldRow.data_type) return;
                this.actionRow = ldRow;
                this.dataType = clDataTypeFactory.createDataType(ldRow.data_type, this, ldRow);
                this.checkFieldValue();
            });
    }
}
class clActionEditDetails extends clAction{
    executeAction(): void {
        this.actionRow = this.actionData[0];
        if (this.actionRow.tab) {
            const LOtabClick = clActionFactory.createAction("On Tab", [this.actionRow]);
            LOtabClick.executeAction();
        }
        const LrowIndex = (this.actionRow.child_index || 1) - 1;
        const LchildSelector = `[data-fieldname="${this.actionRow.child_name}"] .grid-body .grid-row`;
        cy.get(LchildSelector).eq(LrowIndex).within(() => {
            cy.get('.btn-open-row').first().click({ force: true });
        });
        cy.wait(fnGetDelay("medium"));
        this.actionData.forEach(ldRow => {
            if (!ldRow.data_type) return;
            this.actionRow = ldRow;
            this.dataType = clDataTypeFactory.createDataType(ldRow.data_type, this, ldRow);
            this.checkFieldValue();
        });
        cy.get(LchildSelector).eq(LrowIndex).within(() => {
            cy.get('.btn-open-row').first().click({ force: true });
        });
    }
}
/** @class clActionOnTab - Handles tab switching. */
class clActionOnTab extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        const Ltab = this.actionRow.tab;
        if (!Ltab) return;
        cy.get('.form-tabs .nav-item a').filter(`:contains("${Ltab}")`).first().click({ force: true });
        cy.wait(fnGetDelay('medium'));
    }
    constructor(iAction: string, iaActionData: TTactionsData) {
        super(iAction, iaActionData);
    }
}

class clActionSave extends clAction{
    executeAction(): void {
        cy.contains('button', 'Save').scrollIntoView().should('exist').click({force:true});
        cy.log("Document Saved sucessfully");
        cy.wait(fnGetDelay("short"));
    }
}
class clActionSubmit extends clAction{
    executeAction(): void {
        cy.contains('button', 'Submit').scrollIntoView().should('exist').click({force:true});
        cy.wait(fnGetDelay("short"));
        cy.contains('button', 'Yes').scrollIntoView().should('exist').click({force:true});
        cy.wait(fnGetDelay("long"));
        cy.get('.btn-modal-close').click({ force: true });
        cy.log("Document Submitted sucessfully");  
        cy.wait(fnGetDelay("long"));
    }
}
class clActionCancel extends clAction{
    executeAction(): void {
        cy.contains('button', 'Cancel').scrollIntoView().should('exist').click({ force: true });
        cy.wait(fnGetDelay("medium"));
        cy.get('.modal:visible').within(() => {
        cy.contains('button', /^Yes$/).should('be.visible').click({ force: true }); });
        cy.wait(fnGetDelay("long"));
        // Optional: Close modal if it's still there
        // cy.get('.modal:visible').within(() => {
        // cy.get('.btn-modal-close').click({ force: true });
        // });                                                        
        cy.log("Document Cancelled Successfully");
   }
}
class clActionAmend extends clAction{
    executeAction(): void {
        
    }
}

class clActionDelete extends clAction{
    executeAction(): void {
        cy.get('.menu-btn-group > .btn').click({ force: true }); 
        cy.contains('a.dropdown-item', 'Delete').should('be.visible').click({ force: true });
        cy.wait(fnGetDelay("medium"));
        cy.get('.modal:visible').within(() => {
        cy.contains('button', /^Yes$/).should('be.visible').click({ force: true });
        });
        cy.log("Document Deleted Successfully");
        cy.wait(fnGetDelay("long"));
    }
}


class clActionClickButton extends clAction{
    executeAction(): void {
        this.actionRow = this.actionData[0];
        const LbuttonLabel = this.actionRow.value;
        cy.contains('button, a', LbuttonLabel, { matchCase: false }).scrollIntoView().click({ force: true });
        cy.log(`Clicked custom button: ${LbuttonLabel}`);
        cy.wait(fnGetDelay("medium"));
         cy.get('body').then(($body: JQuery<HTMLElement>) => {
                  const hasModal = $body.find('.modal:visible').length > 0;
                  if (hasModal) {
                      cy.get('.modal:visible').within(() => {
                          cy.contains('button', /^Yes$/)
                            .click({ force: true });
                          cy.log('Clicked Yes in modal');
                      });
                  }
              });
    }
}


class clActionCheckbox extends clAction{
    executeAction(): void {
        this.actionRow = this.actionData[0];
        const LfieldName = this.actionRow.field_name;
        const Lvalue = this.actionRow.value;
        if (Lvalue === '1') {
        cy.get(`input[type="checkbox"][data-fieldname="${LfieldName}"]`).first().scrollIntoView()
          .check({ force: true })
          .then(() => {
        cy.log(`Checked checkbox: ${LfieldName}`);
        });
        cy.wait(fnGetDelay("medium"));
        }
    }
}

class clActionActionMenu extends clAction {
    executeAction(): void {
        this.actionRow = this.actionData[0];
        const actionLabel = this.actionRow.value;
        cy.contains('button, a', /^Actions$/i)
          .scrollIntoView()
          .click({ force: true });
        cy.contains('.dropdown-menu li, .dropdown-item, button, a', actionLabel, { matchCase: false })
          .should('be.visible')
          .click({ force: true });
        cy.log(`Clicked Action menu item: ${actionLabel}`);
        cy.wait(fnGetDelay("medium"));
    }
}

/** @class clActionFactory - Factory for creating action instances */
export class clActionFactory {
    private static actionsMap: {
        [key: string]: new (iAction: string, iaActionData: TTactionsData) => clAction } = {
        "Onload": clActionOnLoad,
        "On Change": clActionOnChange,
        "On Tab": clActionOnTab,
        "Add Row": clActionAddRow,
        "Edit Details": clActionEditDetails,
        "Expand Section": clActionExpandSection,
        "Save": clActionSave,
        "Submit": clActionSubmit,
        "Amend": clActionAmend,
        "Cancel":clActionCancel,
        "Delete": clActionDelete,
        "Click Button": clActionClickButton,
        "Check Box": clActionCheckbox,
        "Action Menu": clActionActionMenu,
    };
    static createAction(iAction: string, iaActionData:TTactionsData): ifActionHandler {
        const LAactionClass = this.actionsMap[iAction];       
        if (!LAactionClass) {
          throw new Error(`Invalid action type: ${iAction}`);
        } 
        return new LAactionClass(iAction=iAction,iaActionData=iaActionData);
      }    
    static filterActionData(iaActionsData: TTactionsData, iActionRow: TactionData): TTactionsData {
        const LposNext = iActionRow.pos + 10;
        return iaActionsData.filter((ldItem) => (
            ldItem.pos >= iActionRow.pos && ldItem.pos < LposNext
        ));
    }
    static executeAction(data: TtestHeaderData[]): void {
        const LvalidRows = data.filter(
        row =>
            (row.action === "Create" && row.doctype_to_be_tested.trim()) ||
            (row.action === "Update" && row.doctype_to_be_tested.trim() && row.document.trim())
        );
    if (LvalidRows.length === 0) {
      cy.log("No valid entries found in CaFilteredParent.");
      return;
    }
    LvalidRows.forEach(row => {
        const Ldoctype = row.doctype_to_be_tested.trim().toLowerCase().replace(/\s+/g, "-");
        cy.location("origin").then(origin => {
        let LfullUrl = `${origin}/app/${Ldoctype}`;
        switch (row.action) {
            case "Create":
            LfullUrl += "/new";
            break;
            case "Update":
            const documentName = row.document.trim();
            LfullUrl += `/${documentName}`;
            break;
            default:
            cy.log(`Unsupported action type: ${row.action}`);
            return;
        }
        cy.log(`Navigating to: ${LfullUrl}`);
        cy.visit(LfullUrl);
        cy.wait(fnGetDelay("medium"));
        });
    });
  }
}




