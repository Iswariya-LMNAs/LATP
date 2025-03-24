import { clActionFactory } from "../src/action";
import { clActionOnTab } from "../src/action";
import { expect } from "@jest/globals";
import { clDataTypeFactory } from "../src/dataType";
console.log("Mocked clDataTypeFactory:", clDataTypeFactory.createDataType); // 🔍 Debugging log


jest.mock("../src/action", () => {
  const actualModule = jest.requireActual("../src/action");
  return {
    ...actualModule,
    clActionOnTab: actualModule.clActionOnTab,
  };
}); 
jest.mock("../src/dataType", () => ({
  clDataTypeFactory: {
    createDataType: jest.fn().mockImplementation((data_type, actiondata) => {
      const mockInput = jest.fn();
      const mockValidate = jest.fn();
      return { input: mockInput, validate: mockValidate };
    }),
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
    idx: 1,
    pos: 10,
    field_name: "test_field",
    is_child: false,
    child_index: 0,
    action: "On Tab",
    value: "",
    data_type: "Text",
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

describe("Test clActionOnTab in action.ts", () => {
  describe("Filtering action data", () => {
    test("should filter actions within the correct position range", () => {
      const filteredData = clActionFactory.filterActionData(mockActionData, mockActionData[0]);
      expect(filteredData.length).toBe(1);
      expect(filteredData).toEqual(expect.arrayContaining([mockActionData[0]]));
    });
  });

  describe("Creating an instance of clActionOnTab", () => {
    let actionInstance;

    beforeEach(() => {
      actionInstance = clActionFactory.createAction("On Tab", mockActionData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create clActionOnTab instance when 'On Tab' action is passed", () => {
      expect(actionInstance).toBeInstanceOf(clActionOnTab);
    });
  });

  describe("Executing executeAction method", () => {
    let actionInstance;

    beforeEach(() => {
      actionInstance = clActionFactory.createAction("On Tab", mockActionData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should call clDataTypeFactory.createDataType and input method", () => {
        actionInstance.executeAction();
        expect(clDataTypeFactory.createDataType).toHaveBeenCalledWith("string", actionInstance);
        const mockCreateDataType = clDataTypeFactory.createDataType as jest.Mock;
        const mockDataType = mockCreateDataType.mock.results[0].value;
        expect(mockDataType.input).toBeDefined();
        expect(mockDataType.input).toHaveBeenCalled();
    });
  });

  describe("Handling invalid action types", () => {
    test("should throw an error when an invalid action type is passed", () => {
      expect(() => clActionFactory.createAction("InvalidAction", mockActionData)).toThrow("Invalid action type: InvalidAction");
    });
  });
});



