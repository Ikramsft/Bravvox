/**
 * @format
 */
import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {useManageRoleOperations} from '../Queries/useManageRoleOperations';
import {IMembersData} from '../../Groups/types/GroupInterfaces';
import {ACTIONFROM} from '../Queries/useGroupMember';

interface IAdminEllipseOptions {
  member: IMembersData | undefined;
  id: string; // this id can be groupId, businessId or eventId
  isOpen: boolean;
  from: ACTIONFROM;
  onClose: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const AdminEllipseOptions = forwardRef<IPressHandler, IAdminEllipseOptions>(
  (props: IAdminEllipseOptions, ref) => {
    const {member, id, onClose, isOpen, from} = props;
    const {handleMakeOwner, handleRemoveAdmin} = useManageRoleOperations();

    const {Content} = Actionsheet;
    const {Item} = Actionsheet;

    const makeOwner = () => {
      onClose();
      handleMakeOwner(id, member?.id, from);
    };

    const removeAdmin = () => {
      onClose();
      handleRemoveAdmin(id, member?.id, from);
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Content>
            <Item py="3" onPress={makeOwner}>
              Make Owner
            </Item>
            <Item py="3" onPress={removeAdmin}>
              Remove Admin
            </Item>
          </Content>
        </Actionsheet>
      </View>
    );
  },
);

export type AdminEllipseOptionsHandle = React.ElementRef<typeof AdminEllipseOptions>;
export default AdminEllipseOptions;
