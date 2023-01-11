/**
 * @format
 */
import React from 'react';
import {Modal, Text, ScrollView, useTheme} from 'native-base';

interface ITermsProps {
  isOpen: boolean;
  toggle: () => void;
}

function TermsCondition(props: ITermsProps) {
  const {isOpen, toggle} = props;
  const {colors} = useTheme();

  return (
    <Modal isOpen={isOpen} size="lg" onClose={toggle}>
      <Modal.Content width="90%">
        <Modal.CloseButton onPress={toggle} />
        <Modal.Header>Terms & Conditions</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <Text color={colors.gray[200]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Mattis molestie a iaculis at. In est ante
              in nibh. Egestas dui id ornare arcu odio. Sagittis vitae et leo duis ut diam.
              Pellentesque sit amet porttitor eget dolor morbi non. Sed libero enim sed faucibus
              turpis in eu mi. Ultrices mi tempus imperdiet nulla malesuada pellentesque.
              Scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis. Lacus viverra
              vitae congue eu consequat ac felis donec et. Ullamcorper malesuada proin libero nunc
              consequat. Adipiscing at in tellus integer feugiat scelerisque varius morbi. Elit
              scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Auctor neque
              vitae tempus quam pellentesque nec nam aliquam sem. Etiam tempor orci eu lobortis
              elementum nibh tellus molestie. Quam nulla porttitor massa id neque aliquam vestibulum
              morbi. Condimentum mattis pellentesque id nibh tortor id aliquet. Ipsum dolor sit amet
              consectetur adipiscing elit ut aliquam. Varius duis at consectetur lorem donec massa
              sapien faucibus. Nunc sed velit dignissim sodales ut. At erat pellentesque adipiscing
              commodo elit. Faucibus interdum posuere lorem ipsum dolor. Consectetur lorem donec
              massa sapien faucibus et. Mauris augue neque gravida in. Id interdum velit laoreet id.
              Sit amet massa vitae tortor condimentum. Scelerisque viverra mauris in aliquam. Orci a
              scelerisque purus semper eget duis at tellus. Iaculis eu non diam phasellus vestibulum
              lorem sed risus. Condimentum mattis pellentesque id nibh tortor id aliquet. Odio
              tempor orci dapibus ultrices. Duis tristique sollicitudin nibh sit amet commodo. In
              ornare quam viverra orci. Eu sem integer vitae justo. Mauris nunc congue nisi vitae
              suscipit tellus. Massa ultricies mi quis hendrerit dolor magna eget est lorem. Commodo
              viverra maecenas accumsan lacus vel facilisis volutpat est velit. Lectus mauris
              ultrices eros in cursus turpis massa tincidunt dui. Faucibus ornare suspendisse sed
              nisi lacus sed viverra tellus in. Tempus egestas sed sed risus pretium quam vulputate
              dignissim suspendisse. Est lorem ipsum dolor sit amet consectetur adipiscing elit.
              Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Ultricies tristique
              nulla aliquet enim tortor at auctor. Cursus in hac habitasse platea dictumst quisque.
              Rhoncus est pellentesque elit ullamcorper dignissim cras. Enim nulla aliquet porttitor
              lacus luctus accumsan tortor posuere ac. Lacus vel facilisis volutpat est velit
              egestas dui id. Ultrices neque ornare aenean euismod elementum nisi quis. Neque ornare
              aenean euismod elementum nisi quis eleifend. Nulla malesuada pellentesque elit eget
              gravida cum sociis natoque. Leo in vitae turpis massa sed elementum. Vel quam
              elementum pulvinar etiam non. A diam maecenas sed enim. Sit amet dictum sit amet
              justo. Volutpat odio facilisis mauris sit amet massa. Fringilla urna porttitor rhoncus
              dolor purus non enim. Auctor eu augue ut lectus arcu bibendum at varius. Facilisi
              etiam dignissim diam quis enim lobortis scelerisque fermentum. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Mattis molestie a iaculis at. In est ante in nibh. Egestas dui id
              ornare arcu odio. Sagittis vitae et leo duis ut diam. Pellentesque sit amet porttitor
              eget dolor morbi non. Sed libero enim sed faucibus turpis in eu mi. Ultrices mi tempus
              imperdiet nulla malesuada pellentesque. Scelerisque fermentum dui faucibus in ornare
              quam viverra orci sagittis. Lacus viverra vitae congue eu consequat ac felis donec et.
              Ullamcorper malesuada proin libero nunc consequat. Adipiscing at in tellus integer
              feugiat scelerisque varius morbi. Elit scelerisque mauris pellentesque pulvinar
              pellentesque habitant morbi. Auctor neque vitae tempus quam pellentesque nec nam
              aliquam sem. Etiam tempor orci eu lobortis elementum nibh tellus molestie. Quam nulla
              porttitor massa id neque aliquam vestibulum morbi. Condimentum mattis pellentesque id
              nibh tortor id aliquet. Ipsum dolor sit amet consectetur adipiscing elit ut aliquam.
              Varius duis at consectetur lorem donec massa sapien faucibus. Nunc sed velit dignissim
              sodales ut. At erat pellentesque adipiscing commodo elit. Faucibus interdum posuere
              lorem ipsum dolor. Consectetur lorem donec massa sapien faucibus et. Mauris augue
              neque gravida in. Id interdum velit laoreet id. Sit amet massa vitae tortor
              condimentum. Scelerisque viverra mauris in aliquam. Orci a scelerisque purus semper
              eget duis at tellus. Iaculis eu non diam phasellus vestibulum lorem sed risus.
              Condimentum mattis pellentesque id nibh tortor id aliquet. Odio tempor orci dapibus
              ultrices. Duis tristique sollicitudin nibh sit amet commodo. In ornare quam viverra
              orci. Eu sem integer vitae justo. Mauris nunc congue nisi vitae suscipit tellus. Massa
              ultricies mi quis hendrerit dolor magna eget est lorem. Commodo viverra maecenas
              accumsan lacus vel facilisis volutpat est velit. Lectus mauris ultrices eros in cursus
              turpis massa tincidunt dui. Faucibus ornare suspendisse sed nisi lacus sed viverra
              tellus in. Tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse.
              Est lorem ipsum dolor sit amet consectetur adipiscing elit. Amet risus nullam eget
              felis eget nunc lobortis mattis aliquam. Ultricies tristique nulla aliquet enim tortor
              at auctor. Cursus in hac habitasse platea dictumst quisque. Rhoncus est pellentesque
              elit ullamcorper dignissim cras. Enim nulla aliquet porttitor lacus luctus accumsan
              tortor posuere ac. Lacus vel facilisis volutpat est velit egestas dui id. Ultrices
              neque ornare aenean euismod elementum nisi quis. Neque ornare aenean euismod elementum
              nisi quis eleifend. Nulla malesuada pellentesque elit eget gravida cum sociis natoque.
              Leo in vitae turpis massa sed elementum. Vel quam elementum pulvinar etiam non. A diam
              maecenas sed enim. Sit amet dictum sit amet justo. Volutpat odio facilisis mauris sit
              amet massa. Fringilla urna porttitor rhoncus dolor purus non enim. Auctor eu augue ut
              lectus arcu bibendum at varius. Facilisi etiam dignissim diam quis enim lobortis
              scelerisque fermentum.
            </Text>
          </ScrollView>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default TermsCondition;
