import { createAction, Property } from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from '@activepieces/pieces-common';
import { convertkitAuth } from '../..';
import {
  API_ENDPOINT,
  fetchCustomFields,
  fieldsArray,
  label,
} from '../common/custom-fields';
import { CustomField } from '../common/models';
import { CONVERTKIT_API_URL } from '../common/constants';

export const listFields = createAction({
  auth: convertkitAuth,
  name: 'custom_fields_list_fields',
  displayName: 'Custom Fields: List Fields',
  description: 'Returns a list of all custom fields',
  props: {},
  async run(context) {
    return await fetchCustomFields(context.auth);
  },
});

export const createField = createAction({
  auth: convertkitAuth,
  name: 'custom_fields_create_field',
  displayName: 'Custom Fields: Create Field',
  description: 'Create a new custom field',
  props: {
    fields: fieldsArray,
  },
  async run(context) {
    const url = `${CONVERTKIT_API_URL}/${API_ENDPOINT}`;

    const body = {
      api_secret: context.auth,
      label: context.propsValue.fields,
    };

    const request: HttpRequest = {
      url,
      method: HttpMethod.POST,
      body,
    };

    const response = await httpClient.sendRequest<{
      custom_field: CustomField;
    }>(request);

    if (response.status !== 201) {
      throw new Error(`Error creating field: ${response.status}`);
    }
    return response.body;
  },
});

export const updateField = createAction({
  auth: convertkitAuth,
  name: 'custom_fields_update_field',
  displayName: 'Custom Fields: Update Field',
  description: 'Update a custom field',
  props: {
    label,
    new_label: Property.ShortText({
      displayName: 'New Label',
      description: 'The new label for the custom field',
      required: true,
    }),
  },
  async run(context) {
    const { label, new_label } = context.propsValue;

    const url = `${CONVERTKIT_API_URL}/${API_ENDPOINT}/${label}`;

    const body = {
      api_secret: context.auth,
      label: new_label,
    };

    const request: HttpRequest = {
      url,
      method: HttpMethod.PUT,
      body,
    };

    const response = await httpClient.sendRequest<{
      custom_field: CustomField;
    }>(request);

    if (response.status !== 204) {
      throw new Error(`Error updating field: ${response.status}`);
    }
    return { status: response.status, message: `Field updated`, success: true };
  },
});

export const deleteField = createAction({
  auth: convertkitAuth,
  name: 'custom_fields_delete_field',
  displayName: 'Custom Fields: Delete Field',
  description: 'Delete a custom field',
  props: {
    label,
  },
  async run(context) {
    const { label } = context.propsValue;

    const url = `${CONVERTKIT_API_URL}/${API_ENDPOINT}/${label}`;

    const body = {
      api_secret: context.auth,
    };

    const request: HttpRequest = {
      url,
      method: HttpMethod.DELETE,
      body,
    };

    const response = await httpClient.sendRequest<{
      custom_field: CustomField;
    }>(request);

    if (response.status !== 204) {
      throw new Error(`Error deleting field: ${response.status}`);
    }

    return { status: response.status, message: `Field deleted`, success: true };
  },
});
