/** @interface ifActionHandler - Represents a handler for performing various actions with associated data.*/
interface ifActionHandler {
    action: string
    actionData: TTactionsData
    actionRow: TactionData
    executeAction(): void
    checkFieldValue(): void
    checkFieldProperties(): void
    handleNavigator(): void
    handleMessages(): void
    dataType: ifDataType
}
/**@interface ifDataType - Defines for handling different data types. */
interface ifDataType {
    dataType: string
    action: ifActionHandler
    validate(): void
    input(): void
    execute(): void
}
/**@type TtestHeaderData - Represents test header data structure. Contains details about the doctype_to_be_tested and relevant test field data. */
type TtestHeaderData = {
        name: string;
        owner: string;
        creation: Date;
        modified: Date;
        modified_by: string;
        docstatus: number;
        idx: number;
        title: string;
        sequence: number;
        site: string;
        doctype_to_be_tested: string;
        client_name: string;
        json_response: string;
        doctype: string;
        test_fields: TTactionsData; 
};
/**@type TactionData - Represents the action data.
 * Stores information about an action performed on a field, 
 */
type TactionData = {
    name: string;
    owner: string;
    creation: Date;
    modified: Date;
    modified_by: string;
    docstatus: number;
    idx: number;
    pos: number;
    field_name: string;
    is_child: boolean;
    child_index: number;
    action: string;
    value: string;
    data_type: string;
    allow_on_submit: boolean;
    is_read_only: boolean;
    is_mandatory: boolean;
    is_hidden: boolean;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
};
/**@type TTactionsData - Represents an array of action data. */
type TTactionsData = TactionData[]


  




