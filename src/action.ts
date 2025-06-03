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
            cy.log("Tab click",JSON.stringify(LOtabClick));
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
}

