import { 
    clDataTypeFactory, 
    clDataTypeData, 
    clDataTypeLink, 
    clDataTypeSelect, 
    clDataTypeCurrency, 
    clDataTypeDate, 
    clDataTypeDynamiclink 
} from "../src/dataType";
import { TTactionsData, ifActionHandler } from "../src/types";
import { expect } from '@jest/globals';
import { jest } from '@jest/globals';

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
        field_name: "mock_field_1",
        action: "Onload",
        data_type: "Data",
        value: "Test Value 1",
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
        field_name: "mock_field_2",
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


});
