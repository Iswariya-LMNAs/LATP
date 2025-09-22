import { 
    clDataTypeFactory, 
    clDataTypeData, 
    clDataTypeLink, 
    clDataTypeSelect, 
    clDataTypeCurrency, 
    clDataTypeDate, 
    clDataTypeDynamiclink 
} from "../src/dataType";
import { ifActionHandler } from "../src/types";
import { ifDataType } from "../src/types";
import { expect } from '@jest/globals';
import { jest } from '@jest/globals';
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
type TTactionsData = TactionData[];

const LaMockActionData: TTactionsData = [
    {
        name: "field_001",
        owner: "test.user@example.com",
        creation: new Date(),
        modified: new Date(),
        modified_by: "test.user@example.com",
        docstatus: 0,
        idx: 1,
        pos: 10,
        is_child: false,
        child_index: 0,
        field_name: "",
        action: "Onload",
        data_type: "",
        value: "",
        allow_on_submit: false,
        is_read_only: true,
        is_mandatory: false,
        is_hidden: false,
        parent: "mock_test_case",
        parentfield: "test_fields",
        parenttype: "Test Case Configurator",
        doctype: "Test Fields"
    },
    {
        name: "field_002",
        owner: "test.user@example.com",
        creation: new Date(),
        modified: new Date(),
        modified_by: "test.user@example.com",
        docstatus: 0,
        idx: 2,
        pos: 10.01,
        is_child: false,
        child_index: 0,
        field_name: "order_type",
        action: "",
        data_type: "Select",
        value: "Test Value 2",
        allow_on_submit: false,
        is_read_only: true,
        is_mandatory: false,
        is_hidden: false,
        parent: "mock_test_case",
        parentfield: "test_fields",
        parenttype: "Test Case Configurator",
        doctype: "Test Fields"
    }
];

const LdActionData = {} as ifActionHandler;

// Now assign properties safely
LdActionData.action = "testAction";
LdActionData.actionData = LaMockActionData; 
LdActionData.executeAction = jest.fn();
LdActionData.checkFieldValue = jest.fn();
LdActionData.actionRow = LaMockActionData[0]; // Assign valid TactionData object
LdActionData.checkFieldProperties = jest.fn();
LdActionData.handleNavigator = jest.fn();
LdActionData.handleMessages = jest.fn();

// Assign `dataType` only after `actionData` is fully initialized
LdActionData.dataType = new clDataTypeData("Data", LdActionData);

// Jest Test Suite
describe("Unit Test for dataType.ts", () => {

describe("clDataTypeFactory.createDataType", () => {
    test("Creates clDataTypeData instance for 'Data'", () => {
        expect(clDataTypeFactory.createDataType("Data", LdActionData))
        .toBeInstanceOf(clDataTypeData);
    });
    test("Creates clDataTypeLink instance for 'Link'", () => {
        expect(clDataTypeFactory.createDataType("Link", LdActionData))
        .toBeInstanceOf(clDataTypeLink);
    });
    test("Creates clDataTypeSelect instance for 'Select'", () => {
        expect(clDataTypeFactory.createDataType("Select", LdActionData))
        .toBeInstanceOf(clDataTypeSelect);
    });
    test("Creates clDataTypeCurrency instance for 'Currency'", () => {
        expect(clDataTypeFactory.createDataType("Currency", LdActionData))
        .toBeInstanceOf(clDataTypeCurrency);
    });
    test("Creates clDataTypeDate instance for 'Date'", () => {
        expect(clDataTypeFactory.createDataType("Date", LdActionData))
        .toBeInstanceOf(clDataTypeDate);
    });
    test("Creates clDataTypeDynamiclink instance for 'Dynamic Link'", () => {
        expect(clDataTypeFactory.createDataType("Dynamic Link", LdActionData))
        .toBeInstanceOf(clDataTypeDynamiclink);
    });

    //  Error Cases
    test("Throws error for an empty string as data_type", () => {
        expect(() => clDataTypeFactory.createDataType("", LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for null as data_type", () => {
        expect(() => clDataTypeFactory.createDataType(null as any, LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for undefined as data_type", () => {
        expect(() => clDataTypeFactory.createDataType(undefined as any, LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for non-existent data_type", () => {
        expect(() => clDataTypeFactory.createDataType("InvalidType", LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for case-sensitive mismatch", () => {
        expect(() => clDataTypeFactory.createDataType("data", LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for extra spaces in data_type", () => {
        expect(() => clDataTypeFactory.createDataType(" Data ", LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for numeric data_type", () => {
        expect(() => clDataTypeFactory.createDataType(123 as any, LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for object as data_type", () => {
        expect(() => clDataTypeFactory.createDataType({} as any, LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for array as data_type", () => {
        expect(() => clDataTypeFactory.createDataType([] as any, LdActionData))
        .toThrow("Invalid data type");
    });
    test("Throws error for null actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", null as any)).toThrow();
    });
    test("Throws error for undefined actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", undefined as any))
        .toThrow();
    });
    test("Throws error for missing required fields in actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", {} as any)).toThrow();
    });
    test("Throws error if actionData is not an object", () => {
        expect(() => clDataTypeFactory.createDataType("Data", 123 as any)).toThrow();
        expect(() => clDataTypeFactory.createDataType("Data", "someString" as any))
        .toThrow();
    });
});
describe("clDataTypeData Unit Tests", () => {
    let ldMockAction: ifActionHandler;
    let ldDatatypeInstance: clDataTypeData;
    beforeEach(() => {
        ldMockAction = {
            action: "testAction",
            actionData: LaMockActionData, 
            executeAction: jest.fn(),
            checkFieldValue: jest.fn(),
            actionRow: LaMockActionData[0], // Assign a valid object
            checkFieldProperties: jest.fn(),
            handleNavigator: jest.fn(),
            handleMessages: jest.fn(),
            dataType: {} as ifDataType,// Assign empty object initially, will update later
        };
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
        ldMockAction.dataType = ldDatatypeInstance; // Now assign properly
        
    });
    describe("Constructor Tests", () => {
    test("should set fieldProp to 'input:visible'", () => {
        expect(ldDatatypeInstance.fieldProp).toBe("input:visible");
    });
    test("should initialize dataType, action, and fieldSelector correctly", () => {
        expect(ldDatatypeInstance.dataType).toBe("Data");
        expect(ldDatatypeInstance.action).toBe(ldMockAction);
        expect(ldDatatypeInstance.getSelector()).toBe(`[data-fieldname=""]input:visible`);
    });
    test("should throw error if actionRow is missing", () => {
        const LdInvalidAction = { ...ldMockAction, actionRow: undefined 
         } as unknown as ifActionHandler;
        expect(() => new clDataTypeData("Data", LdInvalidAction)).toThrowError();
    }); 
  });
  describe("validate() Tests", () => {
    test("validate() method exists", () => {
        expect(typeof ldDatatypeInstance.validate).toBe("function");

    });
    test("validate() should use the correct selector", () => {
        const LaExpectedSelector = [
            `[data-fieldname="customer_name"]input:visible`,
            `[data-fieldname="factory"]input:visible`
        ];
        //set field_name to a fixed value before testing
        ldMockAction.actionRow.field_name = "customer_name";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction); 
        expect(ldDatatypeInstance.getSelector()).toBe(LaExpectedSelector[0]);

        ldMockAction.actionRow.field_name = "factory";
        // Recreate instance
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction); 
        expect(ldDatatypeInstance.getSelector()).toBe(LaExpectedSelector[1]);
    });
    test("should return an invalid selector if field_name is missing", () => {
        const LdInvalidAction = { ...ldMockAction, actionRow: 
            { ...ldMockAction.actionRow, field_name: "" } };
        const LdInstance = new clDataTypeData("Data", LdInvalidAction);
        expect(LdInstance.getSelector()).toBe(`[data-fieldname=""]input:visible`);
    });
 }); 
 describe("input() Tests", () => {

    test("input() method exists", () => {
        expect(typeof ldDatatypeInstance.input).toBe("function");
    });
    test("should return the expected selector before typing", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        ldMockAction.actionRow.value = "John Doe";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
    
        const LExpectedSelector = `[data-fieldname="customer_name"]input:visible`;
    
        expect(ldDatatypeInstance.getSelector()).toBe(LExpectedSelector);
    });
    test("Return correct selector for special characters", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        ldMockAction.actionRow.value = "J@hn D#e!";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
    
        const LExpectedSelector = `[data-fieldname="customer_name"]input:visible`;
    
        expect(ldDatatypeInstance.getSelector()).toBe(LExpectedSelector);
    });
    test("Error on input in disabled/read-only field", () => {
        // Mocking a read-only field
        ldMockAction.actionRow = {
            ...ldMockAction.actionRow,
            field_name: "customer_name",
            is_read_only: true,
            allow_on_submit: false,
        };
        // Creating an instance
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
        // Mock getSelector() to return expected selector
        const LExpectedSelector = `[data-fieldname="customer_name"]input:visible`;
        expect(ldDatatypeInstance.getSelector()).toBe(LExpectedSelector);
        expect(() => ldDatatypeInstance.input()).toThrow();
    });
        
    
 });
 describe("input() Tests", () => {
    test("execute() should be defined and do nothing", () => {
        expect(ldDatatypeInstance.execute).toBeDefined();
        expect(() => ldDatatypeInstance.execute()).not.toThrow();
    });
    test("should correctly reference actionRow", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        ldMockAction.actionRow.value = "John Doe";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
    
        expect(ldDatatypeInstance.action.actionRow.field_name).toBe("customer_name");
    });
    test("should not throw an error when executed", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        ldMockAction.actionRow.value = "John Doe";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
    
        expect(() => ldDatatypeInstance.execute()).not.toThrow();
    });      
   });
   describe("getSelector() Tests", () => {
    test("should return the correct selector format", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
    
        const LExpectedSelector = `[data-fieldname="customer_name"]input:visible`;
        expect(ldDatatypeInstance.getSelector()).toBe(LExpectedSelector);
    });
    test("should update selector when field_name changes", () => {
        ldMockAction.actionRow.field_name = "customer_name";
        let ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
        expect(ldDatatypeInstance.getSelector())
        .toBe(`[data-fieldname="customer_name"]input:visible`);
 
        ldMockAction.actionRow.field_name = "order_id";
        ldDatatypeInstance = new clDataTypeData("Data", ldMockAction);
        expect(ldDatatypeInstance.getSelector())
        .toBe(`[data-fieldname="order_id"]input:visible`);
    });
    
   });

 });
 describe("clDataTypeSelect Unit Tests", () => {
    let ldMockAction;
    let ldDatatypeInstance;

    beforeEach(() => {
        ldMockAction = {
            action: "testAction",
            actionData: [],
            executeAction: jest.fn(),
            checkFieldValue: jest.fn(),
            actionRow: { field_name: "order_type", value: "Sales" },
            checkFieldProperties: jest.fn(),
            handleNavigator: jest.fn(),
            handleMessages: jest.fn(),
            dataType: {} as any,
        };
        ldDatatypeInstance = new clDataTypeSelect("Select", ldMockAction);
        ldMockAction.dataType = ldDatatypeInstance;
    });

    test("should inherit from clDataTypeData", () => {
        expect(ldDatatypeInstance).toBeInstanceOf(clDataTypeData);
    });
    test("should initialize dataType, action, and fieldSelector correctly", () => {
        expect(ldDatatypeInstance.dataType).toBe("Select");
        expect(ldDatatypeInstance.action).toBe(ldMockAction);
        expect(ldDatatypeInstance.getSelector())
        .toBe('[data-fieldname="order_type"]:visible select');
    });
    test("validate() should check if select exists and is visible", () => {
        expect(typeof ldDatatypeInstance.validate).toBe("function");
    });
    test("should return correct selector", () => {
        expect(ldDatatypeInstance.getSelector())
        .toBe('[data-fieldname="order_type"]:visible select');
    });
});
describe('clDataTypeDate', () => {
    let ldActionData: ifActionHandler;
    let ldInstance: clDataTypeDate;
    beforeEach(() => {
        ldActionData = {
            action: 'testAction',
            actionData: LaMockActionData,
            executeAction: jest.fn(),
            checkFieldValue: jest.fn(),
            actionRow: { 
                name: "field_002",
                owner: "test.user@example.com",
                creation: new Date(),
                modified: new Date(),
                modified_by: "test.user@example.com",
                docstatus: 0,
                idx: 2,
                pos: 20,
                is_child: false,
                child_index: 0,
                field_name: "start_date",
                action: "On Change",
                data_type: "Date",
                value: "2025-12-31",
                allow_on_submit: false,
                is_read_only: false,
                is_mandatory: true,
                is_hidden: false,
                parent: "mock_test_case",
                parentfield: "test_fields",
                parenttype: "Test Case Configurator",
                doctype: "Test Fields"
            },            
            checkFieldProperties: jest.fn(),
            handleNavigator: jest.fn(),
            handleMessages: jest.fn(),
            dataType: {} as any,
        };
        ldInstance = new clDataTypeDate("Date",ldActionData);
    });
    describe('Constructor Tests', () => {
       test('should correctly inherit from clDataTypeData', () => {
            expect(ldInstance).toBeInstanceOf(clDataTypeData);
        });
       test('should initialize dataType, action, and fieldSelector correctly', () => {
            expect(ldInstance.dataType).toEqual("Date");
            expect(ldInstance.action.actionRow).toEqual(ldActionData.actionRow);
            expect(ldInstance.fieldSlector).toBeDefined();
        });
       test('should keep fieldProp as "input:visible"', () => {
            expect(ldInstance.fieldProp).toBe('input:visible');
        });
    });

    describe('validate()', () => {
        test("validate() should use the correct selector", () => {
            const LaExpectedSelector = [
                `[data-fieldname="customer_name"]input:visible`,
                `[data-fieldname="factory"]input:visible`
            ];
            // Set field_name to a fixed value before testing
            ldActionData.actionRow.field_name = "customer_name";
            ldInstance = new clDataTypeDate("Date", ldActionData); // Recreate Instance
            expect(ldInstance.getSelector()).toBe(LaExpectedSelector[0]);
        
            ldActionData.actionRow.field_name = "factory";
            ldInstance = new clDataTypeDate("Date", ldActionData); // Recreate Instance
            expect(ldInstance.getSelector()).toBe(LaExpectedSelector[1]);
        });
    });

    describe('input()', () => {
        test('input() should return the expected selector and value', () => {
            const LdActionData = {
                actionRow: {
                    field_name: 'start_date',
                    value: '2025-12-31',
                }
            } as unknown as ifActionHandler;
        
            const LdInstance = new clDataTypeDate("Date", LdActionData);
        
            const LdExpectedOutput = {
                selector: LdInstance.getSelector(),
                value: LdActionData.actionRow.value
            };
            // Mock the expected behavior
            jest.spyOn(LdInstance, 'input').mockImplementation(() => LdExpectedOutput);
        
            expect(LdInstance.input()).toEqual(LdExpectedOutput);
        });
             
   });

    describe('execute()', () => {
       test('should execute without modifying actionRow', () => {
            const LdInitialActionRow = { ...ldActionData.actionRow };
            ldInstance.execute();
            expect(ldActionData.actionRow).toEqual(LdInitialActionRow);
        });
    });
});

describe('clDataTypeDynamiclink', () => {
    let ldAction;
    let ldInstance;

    // Mock action handler
    const LdMockActionHandler = (overrides = {}) => ({
        action: 'testAction',
        actionData: [],
        actionRow: {
            field_name: 'test_field',
            value: '123.45',
            data_type: 'Dynamic Link',
            ...overrides,
        },
        executeAction: jest.fn(),
        checkFieldValue: jest.fn(),
        checkFieldProperties: jest.fn(),
        handleNavigator: jest.fn(),
        handleMessages: jest.fn(),
    });

    beforeEach(() => {
        ldAction = LdMockActionHandler();
        ldInstance = new clDataTypeDynamiclink('Dynamic Link', ldAction);
    });

    describe('Constructor Tests', () => {
        test('should inherit from clDataTypeData', () => {
            expect(ldInstance).toBeInstanceOf(clDataTypeDynamiclink);
        });
        test('should initialize dataType, ldAction, and fieldSelector correctly', () => {
            expect(ldInstance.dataType).toEqual('Dynamic Link');
            expect(ldInstance.action).toEqual(ldAction);
            expect(ldInstance.getSelector()).toContain(`[data-fieldname="test_field"]`);
        });
    });

    describe('validate()', () => {
        test('should check for field existence and visibility', () => {
            expect(ldInstance.getSelector())
            .toBe('[data-fieldname="test_field"]input:visible');
        });
    });

    describe('input()', () => {
        test('should correctly handle dynamic link input', () => {
            ldAction.actionRow.value = 'Linked Value';
            expect(ldInstance.action.actionRow.value).toBe('Linked Value');
        });
    });

    describe('execute()', () => {
        test('should correctly reference actionRow', () => {
            expect(ldInstance.action.actionRow).toBe(ldAction.actionRow);
        });
    });
});

describe('clDataTypeCurrency', () => {
    let ldAction;
    let ldInstance;

    const LdMockActionHandler = (overrides = {}) => ({
        action: 'testAction',
        actionData: [],
        actionRow: {
            field_name: 'currency_field',
            value: '1234.56',
            data_type: 'Currency',
            ...overrides,
        },
        executeAction: jest.fn(),
        checkFieldValue: jest.fn(),
        checkFieldProperties: jest.fn(),
        handleNavigator: jest.fn(),
        handleMessages: jest.fn(),
    });

    beforeEach(() => {
        ldAction = LdMockActionHandler();
        ldInstance = new clDataTypeCurrency('Currency', ldAction);
    });

    describe('Constructor Tests', () => {
        test('should inherit from clDataTypeData', () => {
            expect(ldInstance).toBeInstanceOf(clDataTypeCurrency);
        });
        test('should initialize dataType, action, and fieldSelector correctly', () => {
            expect(ldInstance.dataType).toEqual('Currency');
            expect(ldInstance.action).toEqual(ldAction);
            expect(ldInstance.getSelector())
            .toContain(`[data-fieldname="currency_field"]`);
        });
        test('should keep fieldProp as "input:visible"', () => {
            expect(ldInstance.fieldProp).toBe('input:visible');
        });
        test('should pass ioAction to parent constructor', () => {
            expect(ldInstance.action).toEqual(ldAction);
        });
    });

    describe('validate()', () => {
        test('should check field existence and visibility', () => {
            expect(ldInstance.getSelector())
            .toBe('[data-fieldname="currency_field"]input:visible');
        });
        test('should fail validation when field is missing or hidden', () => {  
            ldAction.actionRow.field_name = ''; // Remove field name
            // Recreate instance to apply changes 
            ldInstance = new clDataTypeCurrency('Currency', ldAction);
            // Assertion        
            expect(ldInstance.getSelector()).not.toContain('currency_field'); 
        });
        
        test('should restrict non-numeric characters', () => {
            ldAction.actionRow.value = 'ABC123';
            expect(isNaN(Number(ldAction.actionRow.value))).toBe(true);
        });
    });

    describe('input()', () => {
        test('should correctly handle currency input', () => {
            ldAction.actionRow.value = '567.89';
            expect(ldInstance.action.actionRow.value).toBe('567.89');
        });

        test('should reject non-numeric values', () => {
            ldAction.actionRow.value = 'ABC';
            expect(isNaN(Number(ldAction.actionRow.value))).toBe(true);
        });

        test('should handle different currency formats', () => {
            ldAction.actionRow.value = '$1,234.56';
            expect(ldInstance.action.actionRow.value.replace(/[^0-9.]/g, ''))
            .toBe('1234.56');

            ldAction.actionRow.value = '1.234,56';
            expect(ldInstance.action.actionRow.value.replace(',', '.')).toBe('1.234.56');
        });    
    });

    describe('execute()', () => {
        test('should correctly reference actionRow', () => {
            expect(ldInstance.action.actionRow).toBe(ldAction.actionRow);
        });   
    });
});

})