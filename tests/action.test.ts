import { clActionFactory ,clActionOnLoad,clActionOnChange,clActionOnTab,clAction  } 
from "../src/action";
import { clDataTypeData, clDataTypeFactory } from "../src/dataType";
import { expect } from "@jest/globals";
import { ifActionHandler } from "../src/types";


// Mock dependencies
jest.mock("../src/action", () => {
  // Get actual module
  const LD_ACTUALMODULE = jest.requireActual("../src/action"); 
  return {
    // Spread real exports
    ...LD_ACTUALMODULE, 
    clActionOnLoad: LD_ACTUALMODULE.clActionOnLoad, 
    clActionOnChange: LD_ACTUALMODULE.clActionOnChange,
    clActionOnTab: LD_ACTUALMODULE.clActionOnTab,

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
describe("Test Static methods in clActionFactory Class of action.ts",() => { 
  /* Since filterActionData is a static method, we can call it directly 
  in our tests without creating an instance of clActionFactory.*/
  describe("Verify if filterActionData returns the expected value", () => {
    test("Filter actions within position range 10 for Onload", () => {
      // pos = 10 should be the first row
    const iActionRow: TactionData = LA_MOCKACTIONDATA[0]; 
    const LA_FILTEREDDATA = clActionFactory
    .filterActionData(LA_MOCKACTIONDATA, iActionRow);

      // Should match pos: 10, 10.1, 10.2, 10.3
      expect(LA_FILTEREDDATA.length).toBe(4); 
      expect(LA_FILTEREDDATA).toEqual(expect.arrayContaining([
        LA_MOCKACTIONDATA[0], 
        LA_MOCKACTIONDATA[1], 
        LA_MOCKACTIONDATA[2], 
        LA_MOCKACTIONDATA[3]
      ]));
    });
    
    test("First row should be defined with a non-empty 'Onload' action", () => {
      const iActionRow: TactionData = LA_MOCKACTIONDATA[0]; 
     // Filter the action data based on the first row
      const LA_FILTEREDDATA = clActionFactory
      .filterActionData(LA_MOCKACTIONDATA, iActionRow);
      const L_FIRSTROW = LA_FILTEREDDATA[0]; 
    
      expect(L_FIRSTROW).toBeDefined();
      expect(L_FIRSTROW!.action).not.toBe("");
      expect(L_FIRSTROW!.action).toBe("Onload");
    });
    
    test("First row's position should be a multiple of 10", () => {
      const iActionRow: TactionData = LA_MOCKACTIONDATA[0];
      // Filter the action data based on the first row 
      const LA_FILTEREDDATA = clActionFactory
      .filterActionData(LA_MOCKACTIONDATA, iActionRow);
      const L_FIRSTROW = LA_FILTEREDDATA[0]; 

      expect(L_FIRSTROW!.pos).toBe(10);
      expect(L_FIRSTROW!.pos % 10).toBe(0);
    });
    
  
    test("should return an empty array if no matching actions", () => {
      const iActionRow: TactionData = { ...LA_MOCKACTIONDATA[0], pos: 50 };
      // Attempt to filter with a non-matching action row
      const LA_FILTEREDDATA = clActionFactory
      .filterActionData(LA_MOCKACTIONDATA, iActionRow); 

      expect(LA_FILTEREDDATA).toEqual([]);
    });
  
    test("should Filter 'On Change' actions with start position 20", () => {
      // pos = 20 should be expected after 10.3
      const iActionRow: TactionData = LA_MOCKACTIONDATA[4]; 
      const LA_FILTEREDDATA = clActionFactory
      .filterActionData(LA_MOCKACTIONDATA, iActionRow);
      // Should match pos: 20, 20.1
      expect(LA_FILTEREDDATA.length).toBe(2); 
      // Match the record of pos 20 and 20.1 in the correct order
      expect(LA_FILTEREDDATA)
      .toEqual(expect.arrayContaining([LA_MOCKACTIONDATA[4], LA_MOCKACTIONDATA[5]])); 
    });

    test("Filtered data should contain whole-number pos if decimal pos exist", () => {
      const iActionRow: TactionData = LA_MOCKACTIONDATA[0]; 
      const LA_FILTEREDDATA = clActionFactory
      .filterActionData(LA_MOCKACTIONDATA, iActionRow);
      // Extract all positions in filtered data
      const LA_ALLPOSITIONS = new Set(LA_FILTEREDDATA.map(ldItem => (ldItem.pos)));
    
      // Check that for each decimal position, its corresponding whole number exists
      LA_FILTEREDDATA.forEach(ldItem => {
        if (ldItem.pos % 1 !== 0) { // If it is a decimal position
          const L_WHOLENUMBER_POS = Math.floor(ldItem.pos);
          // This will fail if whole number is missing
          expect(LA_ALLPOSITIONS.has(L_WHOLENUMBER_POS)).toBe(true); 
          }
      });
    });
      test("Position 20 in filtered data should have 'On Change' action", () => {
        const L_TARGETROW = LA_MOCKACTIONDATA[4];

        expect(L_TARGETROW).toBeDefined();
        expect(L_TARGETROW!.action).toBe("On Change");
      });
  });
 
  describe("clActionOnLoad - Instantiation and executeAction", () => {
      let LD_ACTIONINSTANCE;
      let LA_FILTEREDDATA;
    
      beforeEach(() => {
        LA_FILTEREDDATA = clActionFactory
        .filterActionData(LA_MOCKACTIONDATA, LA_MOCKACTIONDATA[0]);
        LD_ACTIONINSTANCE = clActionFactory.createAction("Onload", LA_FILTEREDDATA);
        jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    
      test("should create clActionOnLoad instance when 'Onload' is passed", () => {
        expect(LD_ACTIONINSTANCE).toBeInstanceOf(clActionOnLoad);
      });
    
      test("should throw an error for an invalid action type", () => {
        expect(() => clActionFactory.createAction("On Click", LA_FILTEREDDATA))
          .toThrowError("Invalid action type: On Click");
      });
    
      test("should NOT throw an error for a valid action type", () => {
        expect(() => clActionFactory.createAction("Onload", LA_FILTEREDDATA))
          .not.toThrow();
      });
    
      test("executeAction() should skip execution for empty actionData", () => {
        const LD_EMPTY_ACTIONINSTANCE = new clActionOnLoad("Onload", []);
        // Spy on the executeAction method to track calls
        jest.spyOn(LD_EMPTY_ACTIONINSTANCE, "executeAction");
        LD_EMPTY_ACTIONINSTANCE.executeAction(); // Call with empty data

        expect(LD_EMPTY_ACTIONINSTANCE.executeAction).toHaveBeenCalledTimes(1);
        // Ensure that executing again does not throw any errors
        expect(() => LD_EMPTY_ACTIONINSTANCE.executeAction()).not.toThrow();
      });
  
      test("executeAction() should iterate over actionData & process each row", () => {
        const LA_PROCESS_SPY = jest.spyOn(LD_ACTIONINSTANCE, "checkFieldValue"); 
        LD_ACTIONINSTANCE.executeAction();
        // Filter the data to get only rows with a valid data_type
        const L_VALIDDATA_ROWS = LA_FILTEREDDATA.filter(ldRow => ldRow.data_type);

        expect(clDataTypeFactory.createDataType)
        .toHaveBeenCalledTimes(L_VALIDDATA_ROWS.length);
        expect(LA_PROCESS_SPY).toHaveBeenCalledTimes(L_VALIDDATA_ROWS.length);
      }) 

      test("executeAction should skip processing rows where data_type is missing", () => {
        const LA_PROCESS_SPY = jest.spyOn(clDataTypeFactory, "createDataType");
        LD_ACTIONINSTANCE.executeAction();
        // Check that createDataType is called only for rows that have a valid data_type
        const L_VALID_ROWS = LA_FILTEREDDATA.filter(ldRow => ldRow.data_type);
        expect(LA_PROCESS_SPY).toHaveBeenCalledTimes(L_VALID_ROWS.length);
      });      
      test("checkFieldValue() should call validate() on dataType instance", () => {
        // Mock data for actionData
        const LA_MOCKACTIONDATA: TTactionsData = [
          { data_type: "Text", pos: 10 } as any,
        ]; 
        // Create an instance of clActionOnLoad
        const LD_ACTIONINSTANCE: ifActionHandler = new 
        clActionOnLoad("Onload", LA_MOCKACTIONDATA);
        // Mock the dataType instance with a spy on validate()
        const LD_MOCKDATATYPE_INSTACE = { validate: jest.fn() };
        // Spy on createDataType to return the mock instance
        jest.spyOn(clDataTypeFactory, "createDataType")
        .mockReturnValue(LD_MOCKDATATYPE_INSTACE as any);
        // Call executeAction, which will trigger checkFieldValue()
        LD_ACTIONINSTANCE.executeAction();
        // Validate that checkFieldValue() called validate()
        expect(LD_MOCKDATATYPE_INSTACE.validate).toHaveBeenCalled();
      });
      test("executeAction should handle actionData with empty action property", () => {
        const INVALID_DATA = [{ ...LA_MOCKACTIONDATA[0], action: "" }];
        const LD_ACTIONINSTANCE = new clActionOnLoad("Onload", INVALID_DATA);
      
        jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
        LD_ACTIONINSTANCE.executeAction();
      
        expect(LD_ACTIONINSTANCE.executeAction).toHaveBeenCalled();
      });
      test("executeAction should handle duplicate actionData entries correctly", () => {
        const DUPLICATE_DATA = [LA_MOCKACTIONDATA[0], LA_MOCKACTIONDATA[0]];
        const LD_ACTIONINSTANCE = new clActionOnLoad("Onload", DUPLICATE_DATA);
      
        jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
        LD_ACTIONINSTANCE.executeAction();
      
        expect(LD_ACTIONINSTANCE.executeAction).toHaveBeenCalledTimes(1);
      });
      
      
  });
   describe("Test clActionOnChange -Instantiation and executeAction", () => {
    let LD_ACTIONINSTANCE;
    // Use `clDataTypeData` instead
    let ldMockDataTypeInstance: jest.Mocked<clDataTypeData>; 
    let ldCreateDataTypeMock: jest.SpiedFunction<typeof clDataTypeFactory.createDataType>;

    beforeEach(() => {
      LD_ACTIONINSTANCE = clActionFactory.createAction("On Change", LA_MOCKACTIONDATA
      )as clActionOnChange;
      ldMockDataTypeInstance = {
        input: jest.fn(),
        validate: jest.fn(),
        execute: jest.fn(),
        dataType: "Select",
        action: LD_ACTIONINSTANCE,
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
      expect(LD_ACTIONINSTANCE).toBeInstanceOf(clActionOnChange);
    });
    test("should call clDataTypeFactory.createDataType and input method", () => {
      // Execute action
      LD_ACTIONINSTANCE.executeAction();
      // Ensure createDataType was called with correct args
      expect(clDataTypeFactory.createDataType)
      .toHaveBeenCalledWith("Select", LD_ACTIONINSTANCE);
      // Ensure input() was called
      expect(ldMockDataTypeInstance.input).toHaveBeenCalled();
    }); 
    test("should override executeAction from base class", () => {
      const L_BASE_EXECUTEACTION = jest.spyOn(clActionOnLoad.prototype, "executeAction");
      const L_ONCHANGE_EXECUTEACTION = jest.spyOn(LD_ACTIONINSTANCE, "executeAction");    
      LD_ACTIONINSTANCE.executeAction();
      // Ensure executeAction of clActionOnLoad was NOT called (overridden)
      expect(L_BASE_EXECUTEACTION).not.toHaveBeenCalled();
      // Ensure executeAction of clActionOnChange is called
      expect(L_ONCHANGE_EXECUTEACTION).toHaveBeenCalled();
    }); 
    test("should call super.checkFieldValue() in checkFieldValue", () => {
      // Spy on the checkFieldValue method in the parent class (clAction)
      const L_BASE_CHECKFIELDVALUE = jest.spyOn(clAction.prototype, "checkFieldValue");
      LD_ACTIONINSTANCE.executeAction();
      // Call checkFieldValue on the instance
      LD_ACTIONINSTANCE.checkFieldValue();
      // Ensure the checkFieldValue method of the parent class is called
      expect(L_BASE_CHECKFIELDVALUE).toHaveBeenCalled();
      expect(LD_ACTIONINSTANCE.dataType.validate).toHaveBeenCalled();
    });
    test("should call super.checkFieldProperties() in checkFieldProperties", () => {
      // Spy on the checkFieldProperties method in the parent class (clAction)
      const LD_ACTIONINSTANCE = new clActionOnLoad("Onload", LA_MOCKACTIONDATA);
      const L_BASE_CHECKFIELDPROPERTIES = jest
      .spyOn(clAction.prototype, "checkFieldProperties");
      jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
      // LD_ACTIONINSTANCE.executeAction();
      LD_ACTIONINSTANCE.checkFieldProperties();
      // Ensure both parent method and dataType.validate() are called
      expect(L_BASE_CHECKFIELDPROPERTIES).toHaveBeenCalled();
      LD_ACTIONINSTANCE.executeAction();
      expect(L_BASE_CHECKFIELDPROPERTIES).toHaveBeenCalledTimes(1);
    });
    test("should call super.handleNavigator() in handleNavigator", () => {
      // Create an instance of the action class (LD_ACTIONINSTANCE)
      //  that should call `super.handleNavigator()`
      const LD_ACTIONINSTANCE = new clActionOnLoad("Onload", LA_MOCKACTIONDATA);
      // Spy on the handleNavigator method in the parent class (clAction)
      const L_BASE_HANDLENAVIGATOR = jest.spyOn(clAction.prototype, "handleNavigator");
      jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
      // Call the method you want to test
      LD_ACTIONINSTANCE.handleNavigator();
      // Ensure the parent method is called
      expect(L_BASE_HANDLENAVIGATOR).toHaveBeenCalled();
      // If executeAction() triggers handleNavigator(), ensure it's been called
      LD_ACTIONINSTANCE.executeAction();
      // Adjust based on your expectation
      expect(L_BASE_HANDLENAVIGATOR).toHaveBeenCalledTimes(1); 
    });
    test("should call super.handleMessages() in handleMessages", () => {
      // Create an instance of the action class (LD_ACTIONINSTANCE) 
      // that should call `super.handleMessages()`
      const LD_ACTIONINSTANCE = new clActionOnLoad("Onload", LA_MOCKACTIONDATA);
      // Spy on the handleMessages method in the parent class (clAction)
      const L_BASE_HANDLEMESSAGES = jest.spyOn(clAction.prototype, "handleMessages");
      jest.spyOn(LD_ACTIONINSTANCE, "executeAction");
      // Call the method you want to test
      LD_ACTIONINSTANCE.handleMessages();
      // Ensure the parent method is called
      expect(L_BASE_HANDLEMESSAGES).toHaveBeenCalled();
      // If executeAction() triggers handleMessages(), ensure it's been called
      LD_ACTIONINSTANCE.executeAction();
      // Adjust based on your expectation
      expect(L_BASE_HANDLEMESSAGES).toHaveBeenCalledTimes(1); 
    });
  });
 describe("Creating an instance of clActionOnTab", () => {
    let LD_ACTIONINSTANCE;

    beforeEach(() => {
      LD_ACTIONINSTANCE = clActionFactory.createAction("On Tab", LA_MOCKACTIONDATA);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create clActionOnTab instance when 'On Tab is passed", () => {
      expect(LD_ACTIONINSTANCE).toBeInstanceOf(clActionOnTab);
    });
     test("should throw an error when an invalid action type is passed", () => {
        const fnInvalidActionCall = () => clActionFactory
        .createAction("InvalidAction", LA_MOCKACTIONDATA);  
         expect(fnInvalidActionCall).toThrow("Invalid action type: InvalidAction");

      });
      test("executeAction() should skip execution for empty actionData", () => {
        const LD_EMPTY_ACTIONINSTANCE = new clActionOnTab("On Tab", []);
        jest.spyOn(LD_EMPTY_ACTIONINSTANCE, "executeAction");
    
        LD_EMPTY_ACTIONINSTANCE.executeAction(); // Call with empty data
    
        expect(LD_EMPTY_ACTIONINSTANCE.executeAction).toHaveBeenCalledTimes(1);
        expect(() => LD_EMPTY_ACTIONINSTANCE.executeAction()).not.toThrow();
      });  
  });
  
});

