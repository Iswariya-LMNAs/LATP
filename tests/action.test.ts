import { clActionFactory ,clActionOnLoad,clActionOnChange,clActionOnTab,clAction  } 
from "../src/action";
import { clDataTypeData, clDataTypeFactory } from "../src/dataType";
import { expect } from "@jest/globals";
import { ifActionHandler } from "../src/types";


// Mock dependencies
jest.mock("../src/action", () => {
  // Get actual module
  const LdActualModule = jest.requireActual("../src/action"); 
  return {
    // Spread real exports
    ...LdActualModule, 
    clActionOnLoad: LdActualModule.clActionOnLoad, 
    clActionOnChange: LdActualModule.clActionOnChange,
    clActionOnTab: LdActualModule.clActionOnTab,

  };
});
jest.mock("../src/dataType", () => ({
  clDataTypeFactory: {
    createDataType: jest.fn((data_type, actiondata) => {
        return {
        input: jest.fn(),
        validate: jest.fn(),
      };
    }),
  },
}));

// Sample action data type (based on actual definition from type.ts)
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

// Test data
// Sorted mockdata
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
    // child_name: ,
    child_index: 0,
    field_name: "mock_field_1",
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
    field_name: "mock_field_2",
    action: "",
    data_type: "Select",
    value: "Mock Value 1",
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
    name: "field_003",
    owner: "test.user@example.com",
    creation: new Date(),
    modified: new Date(),
    modified_by: "test.user@example.com",
    docstatus: 0,
    idx: 3,
    pos: 10.02,
    is_child: false,
    child_index: 0,
    field_name: "mock_field_3",
    value: "Mock Value 2",
    action: "",
    data_type: "Link",
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
    name: "field_004",
    owner: "test.user@example.com",
    creation: new Date(),
    modified: new Date(),
    modified_by: "test.user@example.com",
    docstatus: 0,
    idx: 4,
    pos: 10.03,
    is_child: false,
    child_index: 0,
    field_name: "mock_field_4",
    value: "Mock Value 3",
    action: "",
    data_type: "Link",
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
    name: "field_005",
    owner: "test.user@example.com",
    creation: new Date(),
    modified: new Date(),
    modified_by: "test.user@example.com",
    docstatus: 0,
    idx: 5,
    pos: 20,
    is_child: false,
    child_index: 0,
    field_name: "mock_field_5",
    value: "Mock Value 4",
    action: "On Change",
    data_type: "Select",
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
    name: "field_006",
    owner: "test.user@example.com",
    creation: new Date(),
    modified: new Date(),
    modified_by: "test.user@example.com",
    docstatus: 0,
    idx: 6,
    pos: 20.01,
    is_child: false,
    child_index: 0,
    field_name: "mock_field_6",
    value: "Mock Value 5",
    action: "",
    data_type: "Link",
    allow_on_submit: false,
    is_read_only: true,
    is_mandatory: false,
    is_hidden: false,
    parent: "mock_test_case",
    parentfield: "test_fields",
    parenttype: "Test Case Configurator",
    doctype: "Test Fields"
  }];

  ///unsorted array
  const LaUnsortedMockActionData: TTactionsData = [
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
      value: "Mock Value 1",
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
      name: "field_003",
      owner: "test.user@example.com",
      creation: new Date(),
      modified: new Date(),
      modified_by: "test.user@example.com",
      docstatus: 0,
      idx: 3,
      pos: 10.02,
      is_child: false,
      child_index: 0,
      field_name: "mock_field_3",
      value: "Mock Value 2",
      action: "",
      data_type: "Link",
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
      name: "field_001",
      owner: "test.user@example.com",
      creation: new Date(),
      modified: new Date(),
      modified_by: "test.user@example.com",
      docstatus: 0,
      idx: 1,
      pos: 10,
      is_child: false,
      // child_name: ,
      child_index: 0,
      field_name: "mock_field_1",
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
      name: "field_004",
      owner: "test.user@example.com",
      creation: new Date(),
      modified: new Date(),
      modified_by: "test.user@example.com",
      docstatus: 0,
      idx: 4,
      pos: 10.03,
      is_child: false,
      child_index: 0,
      field_name: "mock_field_4",
      value: "Mock Value 3",
      action: "",
      data_type: "Link",
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
      name: "field_005",
      owner: "test.user@example.com",
      creation: new Date(),
      modified: new Date(),
      modified_by: "test.user@example.com",
      docstatus: 0,
      idx: 5,
      pos: 20,
      is_child: false,
      child_index: 0,
      field_name: "mock_field_5",
      value: "Mock Value 4",
      action: "On Change",
      data_type: "Select",
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
      name: "field_006",
      owner: "test.user@example.com",
      creation: new Date(),
      modified: new Date(),
      modified_by: "test.user@example.com",
      docstatus: 0,
      idx: 6,
      pos: 20.01,
      is_child: false,
      child_index: 0,
      field_name: "mock_field_6",
      value: "Mock Value 5",
      action: "",
      data_type: "Link",
      allow_on_submit: false,
      is_read_only: true,
      is_mandatory: false,
      is_hidden: false,
      parent: "mock_test_case",
      parentfield: "test_fields",
      parenttype: "Test Case Configurator",
      doctype: "Test Fields"
    }];
describe("Test Static methods in clActionFactory Class of action.ts",() => { 
  /* Since filterActionData is a static method, we can call it directly 
  in our tests without creating an instance of clActionFactory.*/
  describe("Verify if filterActionData returns the expected value", () => {
    test("Filter actions within position range 10 for Onload", () => {
      // pos = 10 should be the first row
    const iActionRow: TactionData = LaMockActionData[0]; 
    const LaFilteredData = clActionFactory
    .filterActionData(LaMockActionData, iActionRow);

      // Should match pos: 10, 10.1, 10.2, 10.3
      expect(LaFilteredData.length).toBe(4); 
      expect(LaFilteredData).toEqual(expect.arrayContaining([
        LaMockActionData[0], 
        LaMockActionData[1], 
        LaMockActionData[2], 
        LaMockActionData[3]
      ]));
    });
    test("Filter actions within position range 10 for Onload for unsorted array", () => {
    const iActionRow: TactionData = LaUnsortedMockActionData[0]; 
    const LaFilteredData = clActionFactory
    .filterActionData(LaUnsortedMockActionData, iActionRow);

      // Should match pos: 10.1, 10.2
      expect(LaFilteredData.length).toBe(4); 
      expect(LaFilteredData).toEqual(expect.arrayContaining([
        LaUnsortedMockActionData[0], 
        LaUnsortedMockActionData[1], 
        LaUnsortedMockActionData[3],
        LaUnsortedMockActionData[4],

      ]));
    });
    
    test("First row should be defined with a non-empty 'Onload' action", () => {
      const iActionRow: TactionData = LaMockActionData[0]; 
     // Filter the action data based on the first row
      const LaFilteredData = clActionFactory
      .filterActionData(LaMockActionData, iActionRow);
      const LFirstRow = LaFilteredData[0]; 
    
      expect(LFirstRow).toBeDefined();
      expect(LFirstRow!.action).not.toBe("");
      expect(LFirstRow!.action).toBe("Onload");
    });
    
    test("First row's position should be a multiple of 10", () => {
      const iActionRow: TactionData = LaMockActionData[0];
      // Filter the action data based on the first row 
      const LaFilteredData = clActionFactory
      .filterActionData(LaMockActionData, iActionRow);
      const LFirstRow = LaFilteredData[0]; 

      expect(LFirstRow!.pos).toBe(10);
      expect(LFirstRow!.pos % 10).toBe(0);
    });
    
  
    test("should return an empty array when no rows have a matching pos value", () => {
      const iActionRow: TactionData = { ...LaMockActionData[0], pos: 50 };
      // Attempt to filter with a non-matching action row
      const LaFilteredData = clActionFactory
      .filterActionData(LaMockActionData, iActionRow); 
      expect(LaFilteredData).toEqual([]);
    });
  
    test("should Filter 'On Change' actions with start position 20", () => {
      // pos = 20 should be expected after 10.3
      const iActionRow: TactionData = LaMockActionData[4]; 
      const LaFilteredData = clActionFactory
      .filterActionData(LaMockActionData, iActionRow);
      // Should match pos: 20, 20.1
      expect(LaFilteredData.length).toBe(2); 
      // Match the record of pos 20 and 20.1 in the correct order
      expect(LaFilteredData)
      .toEqual(expect.arrayContaining([LaMockActionData[4], LaMockActionData[5]])); 
    });

    test("Filtered data should contain whole-number pos if decimal pos exist", () => {
      const iActionRow: TactionData = LaMockActionData[0]; 
      const LaFilteredData = clActionFactory
      .filterActionData(LaMockActionData, iActionRow);
      // Extract all positions in filtered data
      const LaAllPositions = new Set(LaFilteredData.map(ldItem => (ldItem.pos)));
    
      // Check that for each decimal position, its corresponding whole number exists
      LaFilteredData.forEach(ldItem => {
        if (ldItem.pos % 1 !== 0) { // If it is a decimal position
          const LWholeNumberPos = Math.floor(ldItem.pos);
          // This will fail if whole number is missing
          expect(LaAllPositions.has(LWholeNumberPos)).toBe(true); 
          }
      });
    });
      test("Position 20 in filtered data should have 'On Change' action", () => {
        const LTargetRow = LaMockActionData[4];

        expect(LTargetRow).toBeDefined();
        expect(LTargetRow!.action).toBe("On Change");
      });
  });
 
  describe("clActionOnLoad - Instantiation and executeAction", () => {
      let ldActionInstance;
      let laFilteredData;
    
      beforeEach(() => {
        laFilteredData = clActionFactory
        .filterActionData(LaMockActionData, LaMockActionData[0]);
        ldActionInstance = clActionFactory.createAction("Onload", laFilteredData);
        jest.spyOn(ldActionInstance, "executeAction");
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    
      test("should create clActionOnLoad instance when 'Onload' is passed", () => {
        expect(ldActionInstance).toBeInstanceOf(clActionOnLoad);
      });
      test("should throw an error for an invalid action type", () => {
        expect(() => clActionFactory.createAction("On Click", laFilteredData))
          .toThrowError("Invalid action type: On Click");
      });
      test("should NOT throw an error for a valid action type", () => {
        expect(() => clActionFactory.createAction("Onload", laFilteredData))
          .not.toThrow();
      });
      test("executeAction() should not be called when actionData is empty", () => {
        const LdEmptyActionInstance = new clActionOnLoad("Onload", []);
        // Spy on the executeAction method to track calls
        const LSpy = jest.spyOn(LdEmptyActionInstance, "executeAction");
        LdEmptyActionInstance.executeAction(); // Call with empty data
        // Ensure that executeAction is not called
        expect(LSpy).toHaveBeenCalledTimes(1);
    });
      test("executeAction() should iterate over actionData & process each row", () => {
        const LaProcessSpy = jest.spyOn(ldActionInstance, "checkFieldValue"); 
        ldActionInstance.executeAction();
        // Filter the data to get only rows with a valid data_type
        const LValidDataRows = laFilteredData.filter(ldRow => ldRow.data_type);

        expect(clDataTypeFactory.createDataType)
        .toHaveBeenCalledTimes(LValidDataRows.length);
        expect(LaProcessSpy).toHaveBeenCalledTimes(LValidDataRows.length);
      });
      test("executeAction should skip processing rows where data_type is missing", () => {
        const LaProcessSpy = jest.spyOn(clDataTypeFactory, "createDataType");
        ldActionInstance.executeAction();
        // Check that createDataType is called only for rows that have a valid data_type
        const LValidRows = laFilteredData.filter(ldRow => ldRow.data_type);
        expect(LaProcessSpy).toHaveBeenCalledTimes(LValidRows.length);
      });      
      test("checkFieldValue() should call validate() on dataType instance", () => {
        // Mock data for actionData
        const LaMockActionData: TTactionsData = [
          { data_type: "Text", pos: 10 } as any,
        ]; 
        // Create an instance of clActionOnLoad
        const LdActionInstance: ifActionHandler = new 
        clActionOnLoad("Onload", LaMockActionData);
        // Mock the dataType instance with a spy on validate()
        const LdMockDataType = { validate: jest.fn() };
        // Spy on createDataType to return the mock instance
        jest.spyOn(clDataTypeFactory, "createDataType")
        .mockReturnValue(LdMockDataType as any);
        // Call executeAction, which will trigger checkFieldValue()
        LdActionInstance.executeAction();
        // Validate that checkFieldValue() called validate()
        expect(LdMockDataType.validate).toHaveBeenCalled();
      });
      test("executeAction should handle actionData with empty action property", () => {
        const LInvalidData = [LaMockActionData[1]];
        const LdActionInstance = new clActionOnLoad("Onload", LInvalidData);
        jest.spyOn(LdActionInstance, "executeAction");
        LdActionInstance.executeAction();
      
        expect(LdActionInstance.executeAction).toHaveBeenCalled();
      });
      test("executeAction should handle duplicate actionData entries correctly", () => {
        const LDuplicateData = [LaMockActionData[0], LaMockActionData[0]];
        const LdActionInstance = new clActionOnLoad("Onload", LDuplicateData);
      
        jest.spyOn(LdActionInstance, "executeAction");
        LdActionInstance.executeAction();
      
        expect(LdActionInstance.executeAction).toHaveBeenCalledTimes(1);
      }); 
  });
   describe("Test clActionOnChange -Instantiation and executeAction", () => {
    let ldActionInstance;
    // Use `clDataTypeData` instead
    let ldMockDataTypeInstance: jest.Mocked<clDataTypeData>; 
    let ldCreateDataTypeMock: jest.SpiedFunction<typeof clDataTypeFactory.createDataType>;

    beforeEach(() => {
      ldActionInstance = clActionFactory.createAction("On Change", LaMockActionData
      )as clActionOnChange;
      ldMockDataTypeInstance = {
        input: jest.fn(),
        validate: jest.fn(),
        execute: jest.fn(),
        dataType: "Select",
        action: ldActionInstance,
        // Simulated field selector
        fieldSlector: '[data-fieldname="test_field6"]', 
        fieldProp: "input:visible",
        getSelector: jest.fn(() => '[data-fieldname="test_field6"]input:visible'),
      } as jest.Mocked<clDataTypeData>;
      ldCreateDataTypeMock = jest.spyOn(clDataTypeFactory, "createDataType")
      .mockReturnValue(ldMockDataTypeInstance);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should create clActionOnChange  when 'On Change' is passed", () => {
      expect(ldActionInstance).toBeInstanceOf(clActionOnChange);
    });
    test("should call clDataTypeFactory.createDataType and input method", () => {
      // Execute action
      ldActionInstance.executeAction();
      // Ensure createDataType was called with correct args
      expect(clDataTypeFactory.createDataType)
      .toHaveBeenCalledWith("Select", ldActionInstance);
      // Ensure input() was called
      expect(ldMockDataTypeInstance.input).toHaveBeenCalled();
    }); 
    test("should override executeAction from base class", () => {
      const LBaseExecuteAction = jest.spyOn(clActionOnLoad.prototype, "executeAction");
      const LOnchangeExecuteAction = jest.spyOn(ldActionInstance, "executeAction");    
      ldActionInstance.executeAction();
      // Ensure executeAction of clActionOnLoad was NOT called (overridden)
      expect(LBaseExecuteAction).not.toHaveBeenCalled();
      // Ensure executeAction of clActionOnChange is called
      expect(LOnchangeExecuteAction).toHaveBeenCalled();
    }); 
    test("should call super.checkFieldValue() in checkFieldValue", () => {
      // Spy on the checkFieldValue method in the parent class (clAction)
      const LBaseCheckFieldValue = jest.spyOn(clAction.prototype, "checkFieldValue");
      ldActionInstance.executeAction();
      // Call checkFieldValue on the instance
      ldActionInstance.checkFieldValue();
      // Ensure the checkFieldValue method of the parent class is called
      expect(LBaseCheckFieldValue).toHaveBeenCalled();
      expect(ldActionInstance.dataType.validate).toHaveBeenCalled();
    });
    test("should call super.checkFieldProperties() in checkFieldProperties", () => {
      // Spy on the checkFieldProperties method in the parent class (clAction)
      const LdActionInstance = new clActionOnLoad("Onload", LaMockActionData);
      const LBaseCheckFieldProperties = jest
      .spyOn(clAction.prototype, "checkFieldProperties");
      jest.spyOn(LdActionInstance, "executeAction");
      // LdActionInstance.executeAction();
      LdActionInstance.checkFieldProperties();
      // Ensure both parent method and dataType.validate() are called
      expect(LBaseCheckFieldProperties).toHaveBeenCalled();
      LdActionInstance.executeAction();
      expect(LBaseCheckFieldProperties).toHaveBeenCalledTimes(1);
    });
    test("should call super.handleNavigator() in handleNavigator", () => {
      // Create an instance of the action class (LdActionInstance)
      //  that should call `super.handleNavigator()`
      const LdActionInstance = new clActionOnLoad("Onload", LaMockActionData);
      // Spy on the handleNavigator method in the parent class (clAction)
      const LBaseHandleNavigator = jest.spyOn(clAction.prototype, "handleNavigator");
      jest.spyOn(LdActionInstance, "executeAction");
      // Call the method need to test
      LdActionInstance.handleNavigator();
      // Ensure the parent method is called
      expect(LBaseHandleNavigator).toHaveBeenCalled();
      // If executeAction() triggers handleNavigator(), ensure it's been called
      LdActionInstance.executeAction();
      expect(LBaseHandleNavigator).toHaveBeenCalledTimes(1); 
    });
    test("should call super.handleMessages() in handleMessages", () => {
      // Create an instance of the action class (LdActionInstance) 
      // that should call `super.handleMessages()`
      const LdActionInstance = new clActionOnLoad("Onload", LaMockActionData);
      // Spy on the handleMessages method in the parent class (clAction)
      const LBaseHandleMessages = jest.spyOn(clAction.prototype, "handleMessages");
      jest.spyOn(LdActionInstance, "executeAction");
      // Call the method need to test
      LdActionInstance.handleMessages();
      // Ensure the parent method is called
      expect(LBaseHandleMessages).toHaveBeenCalled();
      // If executeAction() triggers handleMessages(), ensure it's been called
      LdActionInstance.executeAction();
      expect(LBaseHandleMessages).toHaveBeenCalledTimes(1); 
    });
  });
 describe("Creating an instance of clActionOnTab", () => {
    let ldActionInstance;

    beforeEach(() => {
      ldActionInstance = clActionFactory.createAction("On Tab", LaMockActionData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create clActionOnTab instance when 'On Tab is passed", () => {
      expect(ldActionInstance).toBeInstanceOf(clActionOnTab);
    });
     test("should throw an error when an invalid action type is passed", () => {
        const fnInvalidActionCall = () => clActionFactory
        .createAction("InvalidAction", LaMockActionData);  
         expect(fnInvalidActionCall).toThrow("Invalid action type: InvalidAction");

      });
      test("executeAction() should skip execution for empty actionData", () => {
        const LdEmptyActionInstance = new clActionOnTab("On Tab", []);
        jest.spyOn(LdEmptyActionInstance, "executeAction");
    
        LdEmptyActionInstance.executeAction(); // Call with empty data
    
        expect(LdEmptyActionInstance.executeAction).toHaveBeenCalledTimes(1);
        expect(() => LdEmptyActionInstance.executeAction()).not.toThrow();
      });  
  });
  
});

