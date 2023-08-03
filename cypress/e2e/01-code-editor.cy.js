import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Block Tests: Metadata', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('As editor I can add metadata mentions', function () {
    // Complete chained commands
    cy.getSlateEditorAndType('This is a text and this language is code');

    cy.setSlateSelection('language');
    cy.clickSlateButton('Viewer');

    cy.get('.sidebar-container #field-code')
      .type(`running = True
      while running:
          for event in pygame.event.get():
              if event.type == pygame.QUIT:
                  running = False
      
          # Fill the screen with a random color
          r, g, b = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
          screen.fill((r, g, b))
      
          # Draw a random circle
          circle_color = random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)
          circle_radius = random.randint(10, 100)
          circle_pos = random.randint(0, width), random.randint(0, height)
          pygame.draw.circle(screen, circle_color, circle_pos, circle_radius)
      
          # Update the screen
          pygame.display.flip()`);
    cy.get('.sidebar-container .form .header button:first-of-type').click();

    // Save
    cy.toolbarSave();

    // then the page view should contain a link
    cy.get('code').should('exist');
  });
});
