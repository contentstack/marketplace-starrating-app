import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import { useAppLocation } from "../hooks/useAppLocation";

export const CustomFieldExtensionProvider = ({ children }: any) => {
  const [customField, setCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField)) {
        setLoading(true);
        const fieldData = await location.field.getData();
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      await location.field.setData(data);
      setCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCustomField]
  );

  return (
    <CustomFieldExtensionContext.Provider
      value={{ customField, setFieldData, loading }}
    >
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
