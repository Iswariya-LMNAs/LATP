abstract class clProperties implements ifProperties {
    is_read_only: boolean;
    is_mandatory: boolean;
    is_hidden: boolean;
    action: ifActionHandler
    abstract validate(): void 
    getSelector(): string{
        return `${this.fieldSlector}${this.fieldProp}`
    }
}


export class clProperties {
    private static actionsMap: { [key: string]: new (data_type: string, action: ifActionHandler) => clProperties } = {
        "Is Read Only": clReadOnly,
        "Is Mandatory" : clMandatory,
        "Is Hidden" : clHidden, 
    };
    static validateProperties(data_type: string, actiondata: ifActionHandler): clProperties {
        const LA_ACTIONCLASS = this.actionsMap[data_type];
        if (!LA_ACTIONCLASS) {
            throw new Error(`Invalid data type: ${data_type}`);
        }
        return new LA_ACTIONCLASS(data_type, actiondata);
    }
}