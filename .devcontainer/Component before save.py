if not doc.template:
    frappe.throw("Please select the Component Template first.")

l_template = frappe.get_doc("Component Template", doc.template)

ld_ctx = {}

ld_portal_map = {
    "portal_attr_1": doc.portal_attr_1,
    "portal_attr_2": doc.portal_attr_2,
    "portal_attr_3": doc.portal_attr_3
}

l_p_idx = 1
for l_row in l_template.component_attributes:
    if l_row.is_portal:
        # put portal input into ctx with attribute name
        ld_ctx[l_row.attribute_name] = ld_portal_map.get(f"portal_attr_{l_p_idx}")
        l_p_idx += 1


l_b_idx = 1
for l_row in l_template.component_attributes:

    if l_row.is_backend:

        if not l_row.formula:
            frappe.throw(f" Missing formula for backend attribute: {l_row.attribute_name}")

        try:
            l_result = eval(l_row.formula, {}, ld_ctx)

            setattr(doc, f"mf_attr_{l_b_idx}", l_result)

            # append result
            ld_ctx[l_row.attribute_name] = l_result

        except Exception as e:
            frappe.throw(f"Formula Error → {l_row.formula}: {e}")

        l_b_idx += 1