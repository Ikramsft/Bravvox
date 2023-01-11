/**
 * @format
 */
 import React from 'react';
 import {View, HStack} from 'native-base';
 import {SubTitle, Title} from '../../../components/Typography';
 import UserAvatar from '../../../components/UserAvatar';
 import {theme} from '../../../theme';
import {truncateUsername} from '../../../utils';

 interface IMemberItem {
     name:string,
     username:string,
     avatar:string,
 }
 
 interface AutocompleteListItemProps {
   info: IMemberItem;
 }
 
 export default function AutocompleteInviteListItem(props: AutocompleteListItemProps) {
   const {info} = props;
   const {name, username, avatar} = info;
   return (
     <HStack
       borderBottomColor={theme.colors.gray[100]}
       borderBottomWidth={0.5}
       flexDirection="row"
       justifyContent="space-between"
       pr="5"
       py="3.5">
       <View ml="3" width="100%">
         <View alignItems="center" flexDirection="row">
           <UserAvatar mr={2} profilePic={avatar} />
           <View>
             <Title flexShrink={1} numberOfLines={1} textTransform="capitalize">
               {name}
             </Title>
             <SubTitle>@{truncateUsername(username)}</SubTitle>
           </View>
         </View>
       </View>
     </HStack>
   );
 }
 