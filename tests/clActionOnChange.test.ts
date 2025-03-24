import { clActionFactory } from "../src/action";
import { clActionOnChange } from "../src/action";
import { expect } from "@jest/globals";
import { clDataTypeFactory } from "../src/dataType";

jest.mock("../src/action", () => {
  const actualModule = jest.requireActual("../src/action");
  return {
    ...actualModule,
    clActionOnChange: actualModule.clActionOnChange,
  };
});

jest.mock("../src/dataType", () => ({
  clDataTypeFactory: {
    createDataType: jest.fn().mockImplementation((data_type, actiondata) => ({
      input: jest.fn(),
      validate: jest.fn(),
    })),
  },
}));


const mockActionData = [
  {
    name: "Test Action",
    owner: "test.user@lmnas.com",
    creation: new Date(),
    modified: new Date(),
    modified_by: "test.user@lmnas.com",
    docstatus: 1,
    idx: 2,
    pos: 20,
    field_name: "test_field",
    is_child: false,
    child_index: 0,
    action: "On Change",
    value: "",
    data_type: "select",
    allow_on_submit: false,
    is_read_only: true,
    is_mandatory: false,
    is_hidden: false,
    parent: "Test Parent",
    parentfield: "Test Parent Field",
    parenttype: "Test Parent Type",
    doctype: "Test DocType",
  },
];

describe("Test clActionOnChange in action.ts", () => {
  describe("Filtering action data", () => {
    test("should filter actions within the correct position range", () => {
      const filteredData = clActionFactory.filterActionData(mockActionData, mockActionData[0]);
      expect(filteredData.length).toBe(1);
      expect(filteredData).toEqual(expect.arrayContaining([mockActionData[0]]));
    });
  });

  describe("Creating an instance of clActionOnChange", () => {
    let actionInstance;

    beforeEach(() => {
      actionInstance = clActionFactory.createAction("On Change", mockActionData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create clActionOnChange instance when 'On Change' action is passed", () => {
      expect(actionInstance).toBeInstanceOf(clActionOnChange);
    });
  });

  describe("Executing executeAction method", () => {
    let actionInstance;

    beforeEach(() => {
      actionInstance = clActionFactory.createAction("On Change", mockActionData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    test("should call clDataTypeFactory.createDataType and input method", () => {
      // Execute action
      actionInstance.executeAction();
    
      // Ensure createDataType was called with correct args
      expect(clDataTypeFactory.createDataType).toHaveBeenCalledWith("select", actionInstance);
    
      // Capture returned mock object
      const mockDataType = (clDataTypeFactory.createDataType as jest.Mock).mock.results[0].value;

    
      // Ensure input() was called
      expect(mockDataType.input).toHaveBeenCalled();
    });    
  });
});
