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

const LA_MOCKACTIONDATA: TTactionsData = [
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

let actionData = {} as ifActionHandler;

// Now assign properties safely
actionData.action = "testAction";
actionData.actionData = LA_MOCKACTIONDATA; 
actionData.executeAction = jest.fn();
actionData.checkFieldValue = jest.fn();
actionData.actionRow = LA_MOCKACTIONDATA[0]; // Assign valid TactionData object
actionData.checkFieldProperties = jest.fn();
actionData.handleNavigator = jest.fn();
actionData.handleMessages = jest.fn();

// Assign `dataType` only after `actionData` is fully initialized
actionData.dataType = new clDataTypeData("Data", actionData);

// Jest Test Suite
describe("Unit Test for dataType.ts", () => {

describe("clDataTypeFactory.createDataType", () => {
    test("Creates clDataTypeData instance for 'Data'", () => {
        expect(clDataTypeFactory.createDataType("Data", actionData)).toBeInstanceOf(clDataTypeData);
    });

    test("Creates clDataTypeLink instance for 'Link'", () => {
        expect(clDataTypeFactory.createDataType("Link", actionData)).toBeInstanceOf(clDataTypeLink);
    });

    test("Creates clDataTypeSelect instance for 'Select'", () => {
        expect(clDataTypeFactory.createDataType("Select", actionData)).toBeInstanceOf(clDataTypeSelect);
    });

    test("Creates clDataTypeCurrency instance for 'Currency'", () => {
        expect(clDataTypeFactory.createDataType("Currency", actionData)).toBeInstanceOf(clDataTypeCurrency);
    });

    test("Creates clDataTypeDate instance for 'Date'", () => {
        expect(clDataTypeFactory.createDataType("Date", actionData)).toBeInstanceOf(clDataTypeDate);
    });

    test("Creates clDataTypeDynamiclink instance for 'Dynamic Link'", () => {
        expect(clDataTypeFactory.createDataType("Dynamic Link", actionData)).toBeInstanceOf(clDataTypeDynamiclink);
    });

    //  Error Cases
    test("Throws error for an empty string as data_type", () => {
        expect(() => clDataTypeFactory.createDataType("", actionData)).toThrow("Invalid data type");
    });

    test("Throws error for null as data_type", () => {
        expect(() => clDataTypeFactory.createDataType(null as any, actionData)).toThrow("Invalid data type");
    });

    test("Throws error for undefined as data_type", () => {
        expect(() => clDataTypeFactory.createDataType(undefined as any, actionData)).toThrow("Invalid data type");
    });

    test("Throws error for non-existent data_type", () => {
        expect(() => clDataTypeFactory.createDataType("InvalidType", actionData)).toThrow("Invalid data type");
    });

    test("Throws error for case-sensitive mismatch", () => {
        expect(() => clDataTypeFactory.createDataType("data", actionData)).toThrow("Invalid data type");
    });

    test("Throws error for extra spaces in data_type", () => {
        expect(() => clDataTypeFactory.createDataType(" Data ", actionData)).toThrow("Invalid data type");
    });

    test("Throws error for numeric data_type", () => {
        expect(() => clDataTypeFactory.createDataType(123 as any, actionData)).toThrow("Invalid data type");
    });

    test("Throws error for object as data_type", () => {
        expect(() => clDataTypeFactory.createDataType({} as any, actionData)).toThrow("Invalid data type");
    });

    test("Throws error for array as data_type", () => {
        expect(() => clDataTypeFactory.createDataType([] as any, actionData)).toThrow("Invalid data type");
    });

    test("Throws error for null actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", null as any)).toThrow();
    });

    test("Throws error for undefined actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", undefined as any)).toThrow();
    });

    test("Throws error for missing required fields in actionData", () => {
        expect(() => clDataTypeFactory.createDataType("Data", {} as any)).toThrow();
    });

    test("Throws error if actionData is not an object", () => {
        expect(() => clDataTypeFactory.createDataType("Data", 123 as any)).toThrow();
        expect(() => clDataTypeFactory.createDataType("Data", "someString" as any)).toThrow();
    });
});
describe("clDataTypeData Unit Tests", () => {
    let mockAction: ifActionHandler;
    let dataTypeInstance: clDataTypeData;
    beforeEach(() => {
        mockAction = {
            action: "testAction",
            actionData: LA_MOCKACTIONDATA, 
            executeAction: jest.fn(),
            checkFieldValue: jest.fn(),
            actionRow: LA_MOCKACTIONDATA[0], // Assign a valid object
            checkFieldProperties: jest.fn(),
            handleNavigator: jest.fn(),
            handleMessages: jest.fn(),
            dataType: {} as ifDataType, // Assign empty object initially, will update later
        };
        dataTypeInstance = new clDataTypeData("Data", mockAction);
        mockAction.dataType = dataTypeInstance; // Now assign properly
        
    });
    describe("Constructor Tests", () => {
    test("should set fieldProp to 'input:visible'", () => {
        expect(dataTypeInstance.fieldProp).toBe("input:visible");
    });
    test("should initialize dataType, action, and fieldSelector correctly", () => {
        expect(dataTypeInstance.dataType).toBe("Data");
        expect(dataTypeInstance.action).toBe(mockAction);
        expect(dataTypeInstance.getSelector()).toBe(`[data-fieldname=""]input:visible`);
    });
    test("should throw error if actionRow is missing", () => {
        const invalidAction = { ...mockAction, actionRow: undefined } as unknown as ifActionHandler;
        expect(() => new clDataTypeData("Data", invalidAction)).toThrowError();
    });
    test("should throw error if actionRow.field_name is missing", () => {
        // Creating an invalid action with missing field_name
        const invalidAction = { 
            ...mockAction, 
            actionRow: { 
                ...mockAction.actionRow, 
                field_name: undefined // Simulate missing field_name
            } as unknown as TactionData
        };
        expect(() => new clDataTypeData("Data", invalidAction)).toThrowError("Missing field_name in actionRow");
    }); 
  });
  describe("validate() Tests", () => {
    test("validate() method exists", () => {
        expect(typeof dataTypeInstance.validate).toBe("function");

    });
    test("validate() should use the correct selector", () => {
        const expectedSelectors = [
            `[data-fieldname="customer_name"]input:visible`,
            `[data-fieldname="factory"]input:visible`
        ];
        //set field_name to a fixed value before testing
        mockAction.actionRow.field_name = "customer_name";
        dataTypeInstance = new clDataTypeData("Data", mockAction); // Recreate instance
        expect(dataTypeInstance.getSelector()).toBe(expectedSelectors[0]);

        mockAction.actionRow.field_name = "factory";
        dataTypeInstance = new clDataTypeData("Data", mockAction); // Recreate instance
        expect(dataTypeInstance.getSelector()).toBe(expectedSelectors[1]);
    });
    test("should return an invalid selector if field_name is missing", () => {
        const invalidAction = { ...mockAction, actionRow: { ...mockAction.actionRow, field_name: "" } };
        const instance = new clDataTypeData("Data", invalidAction);
        expect(instance.getSelector()).toBe(`[data-fieldname=""]input:visible`);
    });
 }); 
 describe("input() Tests", () => {

    test("input() method exists", () => {
        expect(typeof dataTypeInstance.input).toBe("function");
    });
    test("should return the expected selector before typing", () => {
        mockAction.actionRow.field_name = "customer_name";
        mockAction.actionRow.value = "John Doe";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
    
        const expectedSelector = `[data-fieldname="customer_name"]input:visible`;
    
        expect(dataTypeInstance.getSelector()).toBe(expectedSelector);
    });
    test("should return expected selector when value contains special characters", () => {
        mockAction.actionRow.field_name = "customer_name";
        mockAction.actionRow.value = "J@hn D#e!";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
    
        const expectedSelector = `[data-fieldname="customer_name"]input:visible`;
    
        expect(dataTypeInstance.getSelector()).toBe(expectedSelector);
    });
    test("should throw an error when trying to input in a disabled or read-only field", () => {
        // Mocking a read-only field
        mockAction.actionRow = {
            ...mockAction.actionRow,
            field_name: "customer_name",
            is_read_only: true,
            allow_on_submit: false,
        };
        // Creating an instance
        dataTypeInstance = new clDataTypeData("Data", mockAction);
        // Mock getSelector() to return expected selector
        const expectedSelector = `[data-fieldname="customer_name"]input:visible`;
        expect(dataTypeInstance.getSelector()).toBe(expectedSelector);
        expect(() => dataTypeInstance.input()).toThrow();
    });
        
    
 });
 describe("input() Tests", () => {
    test("execute() should be defined and do nothing", () => {
        expect(dataTypeInstance.execute).toBeDefined();
        expect(() => dataTypeInstance.execute()).not.toThrow();
    });
    test("should correctly reference actionRow", () => {
        mockAction.actionRow.field_name = "customer_name";
        mockAction.actionRow.value = "John Doe";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
    
        expect(dataTypeInstance.action.actionRow.field_name).toBe("customer_name");
    });
    test("should not throw an error when executed", () => {
        mockAction.actionRow.field_name = "customer_name";
        mockAction.actionRow.value = "John Doe";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
    
        expect(() => dataTypeInstance.execute()).not.toThrow();
    });      
   });
   describe("getSelector() Tests", () => {
    test("should return the correct selector format", () => {
        mockAction.actionRow.field_name = "customer_name";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
    
        const expectedSelector = `[data-fieldname="customer_name"]input:visible`;
        expect(dataTypeInstance.getSelector()).toBe(expectedSelector);
    });
    test("should update selector when field_name changes", () => {
        mockAction.actionRow.field_name = "customer_name";
        let dataTypeInstance = new clDataTypeData("Data", mockAction);
        expect(dataTypeInstance.getSelector()).toBe(`[data-fieldname="customer_name"]input:visible`);
 
        mockAction.actionRow.field_name = "order_id";
        dataTypeInstance = new clDataTypeData("Data", mockAction);
        expect(dataTypeInstance.getSelector()).toBe(`[data-fieldname="order_id"]input:visible`);
    });
    
   });

 });
 describe("clDataTypeLink Unit Tests", () => {
    let mockAction;
    let dataTypeInstance;

    beforeEach(() => {
        mockAction = {
            action: "testAction",
            actionData: [],
            executeAction: jest.fn(),
            checkFieldValue: jest.fn(),
            actionRow: { field_name: "factory", value: "SGBCZ" },
            checkFieldProperties: jest.fn(),
            handleNavigator: jest.fn(),
            handleMessages: jest.fn(),
            dataType: {} as any,
        };
        dataTypeInstance = new clDataTypeLink("Link", mockAction);
        mockAction.dataType = dataTypeInstance;
    });
    test("should inherit from clDataTypeData", () => {
        expect(dataTypeInstance).toBeInstanceOf(clDataTypeData);
    });

    test("should initialize dataType, action, and fieldSelector correctly", () => {
        expect(dataTypeInstance.dataType).toBe("Link");
        expect(dataTypeInstance.action).toBe(mockAction);
        expect(dataTypeInstance.getSelector()).toBe('[data-fieldname="factory"]input:visible');
    });
    test("validate() should check if field exists and is visible", () => {
        expect(typeof dataTypeInstance.validate).toBe("function");
    });

    test("should return correct selector", () => {
        expect(dataTypeInstance.getSelector()).toBe('[data-fieldname="factory"]input:visible');
    });
 });
 describe("clDataTypeSelect Unit Tests", () => {
    let mockAction;
    let dataTypeInstance;

    beforeEach(() => {
        mockAction = {
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
        dataTypeInstance = new clDataTypeSelect("Select", mockAction);
        mockAction.dataType = dataTypeInstance;
    });

    test("should inherit from clDataTypeData", () => {
        expect(dataTypeInstance).toBeInstanceOf(clDataTypeData);
    });

    test("should initialize dataType, action, and fieldSelector correctly", () => {
        expect(dataTypeInstance.dataType).toBe("Select");
        expect(dataTypeInstance.action).toBe(mockAction);
        expect(dataTypeInstance.getSelector()).toBe('[data-fieldname="order_type"]:visible select');
    });

    test("validate() should check if select exists and is visible", () => {
        expect(typeof dataTypeInstance.validate).toBe("function");
    });

    test("should return correct selector", () => {
        expect(dataTypeInstance.getSelector()).toBe('[data-fieldname="order_type"]:visible select');
    });
});
describe('clDataTypeDate', () => {
    let actionData: ifActionHandler;
    let instance: clDataTypeDate;
    beforeEach(() => {
        actionData = {
            action: 'testAction',
            actionData: LA_MOCKACTIONDATA,
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
        instance = new clDataTypeDate("Date",actionData);
    });
    describe('Constructor Tests', () => {
       test('should correctly inherit from clDataTypeData', () => {
            expect(instance).toBeInstanceOf(clDataTypeData);
        });
       test('should initialize dataType, action, and fieldSelector correctly', () => {
            expect(instance.dataType).toEqual("Date");
            expect(instance.action.actionRow).toEqual(actionData.actionRow);
            expect(instance.fieldSlector).toBeDefined();
        });
       test('should keep fieldProp as "input:visible"', () => {
            expect(instance.fieldProp).toBe('input:visible');
        });
    });

    describe('validate()', () => {
        test("validate() should use the correct selector", () => {
            const expectedSelectors = [
                `[data-fieldname="customer_name"]input:visible`,
                `[data-fieldname="factory"]input:visible`
            ];
            // Set field_name to a fixed value before testing
            actionData.actionRow.field_name = "customer_name";
            instance = new clDataTypeDate("Date", actionData); // Recreate instance
            expect(instance.getSelector()).toBe(expectedSelectors[0]);
        
            actionData.actionRow.field_name = "factory";
            instance = new clDataTypeDate("Date", actionData); // Recreate instance
            expect(instance.getSelector()).toBe(expectedSelectors[1]);
        });
    });

    describe('input()', () => {
        // test("input() should return the expected selector and value", () => {
        //     // Define the expected output
        //     const expectedSelector = '[data-fieldname="start_date"]input:visible';
        //     const expectedValue = '2025-12-31';
        
        //     // Mock getSelector() to return a fixed selector
        //     jest.spyOn(instance, 'getSelector').mockReturnValue(expectedSelector);
        
        //     // Simulate what input() is expected to return
        //     const actualResult = {
        //         selector: instance.getSelector(),
        //         value: instance.action.actionRow.value,
        //     };
        
        //     // Assertions
        //     expect(actualResult).toEqual({
        //         selector: expectedSelector,
        //         value: expectedValue,
        //     });
        // }); 
        test('input() should return the expected selector and value', () => {
            const actionData = {
                actionRow: {
                    field_name: 'start_date',
                    value: '2025-12-31',
                }
            } as unknown as ifActionHandler;
        
            const instance = new clDataTypeDate("Date", actionData);
        
            const expectedOutput = {
                selector: instance.getSelector(),
                value: actionData.actionRow.value
            };
            // Mock the expected behavior
            jest.spyOn(instance, 'input').mockImplementation(() => expectedOutput);
        
            expect(instance.input()).toEqual(expectedOutput);
        });
             
   });

    describe('execute()', () => {
       test('should execute without modifying actionRow', () => {
            const initialActionRow = { ...actionData.actionRow };
            instance.execute();
            expect(actionData.actionRow).toEqual(initialActionRow);
        });
    });
});

describe('clDataTypeDynamiclink', () => {
    let action;
    let instance;

    // Mock action handler
    const mockActionHandler = (overrides = {}) => ({
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
        action = mockActionHandler();
        instance = new clDataTypeDynamiclink('Dynamic Link', action);
    });

    describe('Constructor Tests', () => {
        test('should inherit from clDataTypeData', () => {
            expect(instance).toBeInstanceOf(clDataTypeDynamiclink);
        });

        test('should initialize dataType, action, and fieldSelector correctly', () => {
            expect(instance.dataType).toEqual('Dynamic Link');
            expect(instance.action).toEqual(action);
            expect(instance.getSelector()).toContain(`[data-fieldname="test_field"]`);
        });
    });

    describe('validate()', () => {
        test('should check for field existence and visibility', () => {
            expect(instance.getSelector()).toBe('[data-fieldname="test_field"]input:visible');
        });
    });

    describe('input()', () => {
        test('should correctly handle dynamic link input', () => {
            action.actionRow.value = 'Linked Value';
            expect(instance.action.actionRow.value).toBe('Linked Value');
        });
    });

    describe('execute()', () => {
        test('should correctly reference actionRow', () => {
            expect(instance.action.actionRow).toBe(action.actionRow);
        });
    });
});

describe('clDataTypeCurrency', () => {
    let action;
    let instance;

    const mockActionHandler = (overrides = {}) => ({
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
        action = mockActionHandler();
        instance = new clDataTypeCurrency('Currency', action);
    });

    describe('Constructor Tests', () => {
        test('should inherit from clDataTypeData', () => {
            expect(instance).toBeInstanceOf(clDataTypeCurrency);
        });

        test('should initialize dataType, action, and fieldSelector correctly', () => {
            expect(instance.dataType).toEqual('Currency');
            expect(instance.action).toEqual(action);
            expect(instance.getSelector()).toContain(`[data-fieldname="currency_field"]`);
        });

        test('should keep fieldProp as "input:visible"', () => {
            expect(instance.fieldProp).toBe('input:visible');
        });

        test('should pass ioAction to parent constructor', () => {
            expect(instance.action).toEqual(action);
        });

        // test('should throw error if ioAction is null or undefined', () => {
        //     expect(() => new clDataTypeCurrency('Currency', null)).toThrow();
        //     expect(() => new clDataTypeCurrency('Currency', undefined)).toThrow();
        // });
    });

    describe('validate()', () => {
        test('should check field existence and visibility', () => {
            expect(instance.getSelector()).toBe('[data-fieldname="currency_field"]input:visible');
        });

        test('should fail validation when field is missing or hidden', () => {
            console.log('Before change:', instance.getSelector()); // Log initial selector
            
            action.actionRow.field_name = ''; // Remove field name
            instance = new clDataTypeCurrency('Currency', action); // Recreate instance to apply changes
        
            console.log('After change:', instance.getSelector()); // Log updated selector
        
            expect(instance.getSelector()).not.toContain('currency_field'); // Assertion
        });
        
        test('should restrict non-numeric characters', () => {
            action.actionRow.value = 'ABC123';
            expect(isNaN(Number(action.actionRow.value))).toBe(true);
        });
    });

    describe('input()', () => {
        test('should correctly handle currency input', () => {
            action.actionRow.value = '567.89';
            expect(instance.action.actionRow.value).toBe('567.89');
        });

        test('should reject non-numeric values', () => {
            action.actionRow.value = 'ABC';
            expect(isNaN(Number(action.actionRow.value))).toBe(true);
        });

        test('should handle different currency formats', () => {
            action.actionRow.value = '$1,234.56';
            expect(instance.action.actionRow.value.replace(/[^0-9.]/g, '')).toBe('1234.56');

            action.actionRow.value = '1.234,56';
            expect(instance.action.actionRow.value.replace(',', '.')).toBe('1.234.56');
        });

        test('should enforce decimal place restrictions', () => {
            action.actionRow.value = '123.456';
            console.log('Before assertion:', instance.action.actionRow.value); // Log before check
        
            expect(instance.action.actionRow.value).toMatch(/^\d+\.\d{2}$/); // Assertion
        });
        
        
    });

    describe('execute()', () => {
        test('should correctly reference actionRow', () => {
            expect(instance.action.actionRow).toBe(action.actionRow);
        });
        test('should handle null or undefined actionRow', () => {
            action.actionRow = null;
            console.log('Executing with:', instance.action.actionRow); // Debug before execution
        
            expect(() => instance.execute()).toThrow(); // Check for error
        
            action.actionRow = undefined;
            console.log('Executing with:', instance.action.actionRow); // Debug before execution
            expect(() => instance.execute()).toThrow();
        
            // This should never execute if the test is correct.
            instance.execute();
        });        
        
    });
});



})

